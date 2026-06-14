import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/client";
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
    return prisma.livre.delete({
        where: {id: id}
    })
    
}

async function supprimerAnciens(annee:number) {
    return prisma.livre.deleteMany({
        where: {
            annee: { lt: annee}
        }
    })
}

async function emprunterLivre(id:number, nomMembre:string) {
    const emprunt = await prisma.emprunt.create({
        data:{
            empruntePar: nomMembre,
            livre: {
                connect: {id}
            }
        }
    })

    if (emprunt === null || emprunt ===undefined) { throw new Error("Un emprunt n'a pu être effectué.")}

    await marquerIndispo(id)

    return emprunt
}

async function listerEmprunts() {

    return await prisma.emprunt.findMany({
        include: {livre:true}
    })
    
}

async function rendreLivre(idEmprunt:number) {

    let resultat = null;

    try {
        resultat = await prisma.emprunt.delete({
            where:{id:idEmprunt}
        })
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code==="P2025") {
            console.log("L'opération a échouée: un emprunt n'a pas été trouvé pour la suppresion.  Verifiez votre ID.")
        } else {
            throw error
        }

        return
    }
    
    
    try {
        await prisma.livre.update({
            where: { id: resultat.livreId ?? null},
            data: { disponible: true}
        })
    } catch(error) {
        if (error instanceof PrismaClientValidationError) {
            console.log("Opération échouée.  Vérifiez les arguments fournies pour la MAJ.")
        }
        else if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
            console.log("Opération échouée. Livre introuvable pour la MAJ.")
        }

    }
    
    
    
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

    console.log(await marquerIndispo(1))

    console.log(await corrigerAnnee(2,1901))

    //console.log(await emprunterLivre(1,'Amit Chandel'))

    console.log(await listerEmprunts())


    
    await prisma.$disconnect();
}

main().catch(e=>{
    console.error(e);
    process.exit(1)
});