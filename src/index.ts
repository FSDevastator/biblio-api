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

async function getLivresDispo() {
    return prisma.livre.findMany({
        where: { disponible:true }
    });
}

async function getLivreParId(id:number) {

    return prisma.livre.findUnique({
        where: {id}
    })
    
}

async function chercherParAuteur(motCle: string) {
    return prisma.livre.findMany({
        where: {
            auteur: { contains: motCle, mode:"insensitive"}
        }
    })
    
}

async function marquerIndispo(id: number) {
    return prisma.livre.update({
        where: {id},
        data:{disponible : false},
    });
}

async function corrigerAnnee(id:number, nouvelleAnnee: number) {
    return prisma.livre.update({
        where: {id},
        data: {annee:nouvelleAnnee},
    });
}

async function supprimerLivre(id:number) {
    
    
}



async function main() {

    console .log("\n--- Tous les livres ---");
    console.log(await getTousLesLivres());

    console .log("\n--- Livres disponibles ---");
    console .log( await getLivresDispo ());

    console .log("\n--- Livre #1 ---");
    console .log( await getLivreParId (1) );

    console .log ("\n--- Recherche : ’jonny ’ ---");
    console .log ( await chercherParAuteur ("jonny"));

    console .log(await marquerIndispo(1));
    console .log(await corrigerAnnee(2, 2024));

    
    await prisma.$disconnect();
}

main().catch(e=>{
    console.error(e);
    process.exit(1)
});