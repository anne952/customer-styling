import { Router } from "express";
import prisma from "../prisma";
import { authenticate } from "../middleware/auth";

const router = Router();

// --- POST like (toggle like/dislike)
router.post("/", authenticate, async (req, res) => {
  try {
    const { produitId } = req.body;
    const userId = req.user!.id;

    if (!produitId || typeof produitId !== "number") {
      return res.status(400).json({ message: "produitId requis et doit être un nombre" });
    }

    // Vérifier si le produit existe
    const product = await prisma.produit.findUnique({ where: { id: produitId } });
    if (!product) {
      return res.status(404).json({ message: "Produit introuvable" });
    }

    // Vérifier si le like existe déjà
    const existingLike = await prisma.like.findUnique({
      where: {
        usersId_produitId: {
          usersId: userId,
          produitId: produitId,
        },
      },
    });

    if (existingLike) {
      // Dislike : supprimer le like
      await prisma.like.delete({
        where: {
          usersId_produitId: {
            usersId: userId,
            produitId: produitId,
          },
        },
      });
      res.json({ liked: false, message: "Like retiré" });
    } else {
      // Like : créer le like
      await prisma.like.create({
        data: {
          usersId: userId,
          produitId: produitId,
        },
      });
      res.status(201).json({ liked: true, message: "Like ajouté" });
    }
  } catch (error) {
    console.error('Erreur toggle like:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// --- GET mes likes
router.get("/", authenticate, async (req, res) => {
  try {
    const userId = req.user!.id;

    const likes = await prisma.like.findMany({
      where: { usersId: userId },
      include: {
        produit: {
          include: {
            productImages: true,
            categorie: true,
            couleurs: { include: { couleur: true } },
          },
        },
      },
    });

    res.json(likes.map(like => ({
      id: like.id,
      produitId: like.produitId,
      produit: like.produit,
      createdAt: like.createdAt,
    })));
  } catch (error) {
    console.error('Erreur récupération likes:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
