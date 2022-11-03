import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return await getFaq(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

const getFaq = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const faqs = await prisma.faq.findMany();
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json(error);
  }
};
