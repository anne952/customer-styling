import { Router } from "express";
import { Prisma } from "@prisma/client";  
import prisma from "../prisma";          

import { authenticate, requireRoles } from "../middleware/auth";

const router = Router();

// --- GET produits (publique, avec pagination)
router.get("/", async (req, res) => {
  const skip = Number(req.query.skip) || 0;
  const take = Number(req.query.take) || 20;

  const produits = await prisma.produit.findMany({
    skip,
    take,
    include: { categorie: true, productImages: true, couleurs: { include: { couleur: true } } },
    orderBy: { id: "desc" },
  });

  res.json(produits);
});

// --- GET produit par ID (publique)
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "id invalide" });

  try {
    const produit = await prisma.produit.findUnique({
      where: { id },
      include: {
        categorie: true,
        productImages: true,
        couleurs: { include: { couleur: true } },
        vendeur: { select: { id: true, nom: true, email: true } }, // Inclure le vendeur
      },
    });

    if (!produit) return res.status(404).json({ message: "Produit introuvable" });

    res.json(produit);
  } catch (error) {
    console.error('Erreur récupération produit:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// --- GET recherche produits (publique)
router.get("/search", async (req, res) => {
  try {
    const query = (req.query.q as string)?.trim();
    if (!query) {
      return res.status(400).json({ message: "Paramètre 'q' requis pour la recherche" });
    }

    const produits = await prisma.produit.findMany({
      where: {
        OR: [
          { nom: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: { categorie: true, productImages: true, couleurs: { include: { couleur: true } } },
      orderBy: { id: "desc" },
      take: 50 // Limiter les résultats de recherche
    });

    res.json(produits);
  } catch (error) {
    console.error('Erreur recherche produits:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la recherche' });
  }
});

// --- POST produit (admin ou vendeur)
router.post(
  "/",
  authenticate,
  requireRoles("admin", "vendeur"),
  async (req, res) => {
    try {
      const {
        nom,
        description,
        prix,
        taille,
        video,
        images,
      } = req.body as {
        nom: string;
        description: string;
        prix: string;
        taille: "L" | "S" | "M" | "XL" | "XXL" | "XXXL";
        video?: string;
        images?: string[];
      };

      const categorieId = Number((req.body as any).categorieId);
      const couleurId = Number((req.body as any).couleurId);

      // --- Validation categorie
      if (!categorieId || Number.isNaN(categorieId)) {
        return res.status(400).json({ message: "categorieId invalide" });
      }
      const cat = await prisma.categorie.findUnique({ where: { id: categorieId } });
      if (!cat) {
        return res.status(400).json({ message: `Categorie introuvable: ${categorieId}` });
      }

      // --- Validation couleur
      if (!couleurId || Number.isNaN(couleurId)) {
        return res.status(400).json({ message: "couleurId invalide" });
      }
      const color = await prisma.couleur.findUnique({ where: { id: couleurId } });
      if (!color) {
        return res.status(400).json({ message: `Couleur introuvable: ${couleurId}` });
      }

      // --- Déterminer le vendeurId
      let vendeurId: number | undefined;
      if (req.user!.role === "vendeur") {
        vendeurId = req.user!.id;
      } else {
        const bodyVendeurId = (req.body as any).vendeurId;
        if (bodyVendeurId !== undefined && bodyVendeurId !== null) {
          const vid = Number(bodyVendeurId);
          if (Number.isNaN(vid)) {
            return res.status(400).json({ message: "vendeurId invalide" });
          }
          const vendeur = await prisma.users.findUnique({ where: { id: vid } });
          if (!vendeur || vendeur.role !== "vendeur") {
            return res.status(400).json({
              message: `vendeurId ${vid} invalide (utilisateur introuvable ou rôle ≠ vendeur)`,
            });
          }
          vendeurId = vid;
        }
      }

      // --- Validation images et vidéo obligatoires
      if (!images || !Array.isArray(images) || images.length === 0) {
        return res.status(400).json({ message: "Au moins une image est requise pour le produit" });
      }

      // --- Création du produit
      const created = await prisma.produit.create({
        data: {
          nom,
          description,
          prix: new Prisma.Decimal(prix),
          taille,
          categorieId,
          vendeurId,
          video,
          couleurs: { create: [{ couleurId }] },
        },
      });

      // --- Créer les images du produit
      const productImages = images.map((url: string) => ({
        url,
        productId: created.id,
      }));
      await prisma.productImage.createMany({ data: productImages });

      // --- Retourner le produit complet
      const productWithRelations = await prisma.produit.findUnique({
        where: { id: created.id },
        include: { categorie: true, productImages: true, couleurs: { include: { couleur: true } } },
      });

      res.status(201).json(productWithRelations);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ message: "Erreur serveur lors de la création du produit" });
    }
  }
);

// --- DELETE produit (admin ou vendeur)
router.delete(
  "/:id",
  authenticate,
  requireRoles("admin", "vendeur"),
  async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ message: "id invalide" });

    try {
      const product = await prisma.produit.findUnique({ where: { id } });
      if (!product) return res.status(404).json({ message: "Produit introuvable" });

      if (req.user!.role === "vendeur" && product.vendeurId !== req.user!.id) {
        return res.status(403).json({ message: "Accès interdit" });
      }

      await prisma.produit.delete({ where: { id } });
      res.status(204).send();
    } catch (err: any) {
      if (err.code === "P2025") {
        return res.status(404).json({ message: "Produit introuvable" });
      }
      console.error(err);
      res.status(500).json({ message: "Erreur serveur lors de la suppression" });
    }
  }
);

export default router;
