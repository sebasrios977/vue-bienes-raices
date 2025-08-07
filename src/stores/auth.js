import { ref, computed, onMounted } from 'vue';
import { defineStore } from "pinia";
import { useFirebaseAuth } from 'vuefire';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {

    const auth = useFirebaseAuth();
    const authUser = ref(null);
    const router = useRouter();


    const errorMessage = ref('');
    const errorCodes = {
        'auth/invalid-credential': 'Las credenciales no son válidas.',
    }

    onMounted(() => {
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                authUser.value = null;
                return;
            }

            authUser.value = user;
        });
    });

    const login = ({email, password}) => {
        signInWithEmailAndPassword(auth, email, password)
            .then( (userCredential) => {
                errorMessage.value = '';
                const user = userCredential.user;
                authUser.value = user;
                router.push({ name: 'admin-propiedades' });
            })
            .catch( (error) => {
                errorMessage.value = errorCodes[error.code];
            });
    }

    const logout = () => {
        signOut(auth)
            .then(() => {
                authUser.value = null;
                errorMessage.value = '';
                router.push({ name: 'login' });
            })
            .catch((error) => {
                errorMessage.value = 'Error al cerrar sesión: ' + error.message;
            });
    }

    const hasError = computed(() => {
        return errorMessage.value !== '';
    });

    const isAuth = computed(() => {
        return authUser.value;
    });

    return {
        login,
        logout,
        errorMessage,
        hasError,
        isAuth,
    }
});