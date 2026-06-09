import prisma from "../utils/prisma.js"

async function seed() {
    const livre1 = await prisma.livre.create({
        data: {
            titre: "Comparative politics: A Canadian perspective",
            auteur: "Jonny Boy",
            annee: 1943,
            disponible: true,
        }
    });

    console.log("Cree: ", livre1);

    const livre2 = await prisma.livre.create({
        data: {
            titre: "Flying for dummies",
            auteur: "Lil Marco",
            annee: 1975,
            disponible: true,
        }
    });

    console.log("Cree: ", livre2);

    const livre3 = await prisma.livre.create({
        data: {
            titre: "Woodworking",
            auteur: "Some guy",
            annee: 1990,
            disponible: false,
        }
    });

    console.log("Cree: ", livre3);

    const livre4 = await prisma.livre.create({
        data: {
            titre: "How to be bored",
            auteur: "Someother Guy",
            annee: 2026,
            disponible: true,
        }
    });

    console.log("Cree: ", livre4);

    const livre5 = await prisma.livre.create({
        data: {
            titre: "Signals and systems",
            auteur: "Jonny Boy",
            annee: 2011,
            disponible: true,
        }
    });

    console.log("Cree: ", livre5);

}

async function getTousLesLivres() {
    return prisma.livre.findMany();
}

async function main() {

    console .log("\n--- Tous les livres ---");
    console.log(await getTousLesLivres());
    
    await prisma.$disconnect();
}

main().catch(e=>{
    console.error(e);
    process.exit(1)
});