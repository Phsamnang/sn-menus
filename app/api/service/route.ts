import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const serviceId = searchParams.get("serviceId");
        const service = await prisma.menuItem.findMany({
            where: { },
        });
        return Response.json(service);
    } catch (error) {
        return Response.json({ error: "Failed to fetch service" }, { status: 500 });
    }
}

export async function POST(request: Request) {
  return Response.json({ message: "Hello, world!" });
}

export async function PUT(request: Request) {
  return Response.json({ message: "Hello, world!" });
}