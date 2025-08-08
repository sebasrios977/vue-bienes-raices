import { collection } from "firebase/firestore";
import { useFirestore, useCollection } from 'vuefire';

export default function usePropiedades() {

    const db = useFirestore();
    const propiedadesCollection = useCollection(collection(db, 'propiedades'));

    const propertyPrice = (price) => {
        return Number(price).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        });
    }

    return {
        propiedadesCollection,
        propertyPrice
    }
}