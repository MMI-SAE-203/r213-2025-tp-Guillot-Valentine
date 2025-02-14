import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

export async function getOffres() {
    try {
        let data = await pb.collection('Maison').getFullList({
            sort: '-created',
        });
        data = data.map((ev) => {
            ev.img= pb.files.getURL(ev, ev.photo_maison);
            return ev;
        });
        return data;
    } catch (error) {
        console.log('Une erreur est survenue en lisant la liste des maisons', error);
        return [];
    }
}

export async function getOffre(id) {
    try {
        let data = await pb.collection('Maison').getOne(id);
        data.imageUrl = pb.files.getURL(data, data.image);
        return data;
    } catch (error) {
        console.log('Une erreur est survenue en lisant la maison', error);
        return null;
    }
}

export async function getOffresBySurface(s) {
    let surface = await pb.collection('Maison').getFullList({
        filter: `superficie_maison> ${s}` ,
    });
     surface = surface.map((ev) => {
            ev.img= pb.files.getURL(ev, ev.photo_maison);
            return ev;
        });
    return surface;
}

export async function getOffresByPrice(p) {
    let prix = await pb.collection('Maison').getFullList({
        filter: `prix_maison< ${p}` ,
    });
     prix = prix.map((ev) => {
            ev.img= pb.files.getURL(ev, ev.photo_maison);
            return ev;
        });
    return prix;
}

export async function addOffre(house) {
    try {
        await pb.collection('Maison').create(house);
        return {
            success: true,
            message: 'Offre ajoutée avec succès'
        };
    } catch (error) {
        console.log('Une erreur est survenue en ajoutant la maison', error);
        return {
            success: false,
            message: 'Une erreur est survenue en ajoutant la maison'
        };
    }
}

export async function filterByPrix(prixMin, prixMax) {
    try {
        let data = await pb.collection('Maison').getFullList({
            sort: '-created',
            filter: `prix_maison >= ${prixMin} && prix_maison <= ${prixMax}`
        });
        data = data.map((maison) => {
            maison.img = pb.files.getURL(maison, maison.photo_maison);
            return maison;
        });
        return data;
    } catch (error) {
        console.log('Une erreur est survenue en filtrant la liste des maisons', error);
        return [];
    }
}