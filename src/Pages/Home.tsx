import { useNavigate } from 'react-router-dom';
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';
import '../styles/auth.scss';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth' // Hook para fazer a importação do useCOntext e useAuth ao mesmo tempo

export function Home() {
    // useNavigate é um hook de navegação entre telas
    // usamos ele em conjunto com uma função. Quando chamada, ela irá direcionar
    // para a página passada para navigate
    const navigate = useNavigate();
    const { user, singInWithGoogle } = useAuth();

    async function handleCreateRoom() {
        // Se o usuário não estiver autenticado
        if(!user) { 
            await singInWithGoogle();
        }

        navigate('/rooms/new');
    }

    // <aside> será a área colorida na lateral esquerda
    // <main> será a área principal ao lado direito
    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas"/>
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>
            <main>
                <div className='main-content'>
                    <img src={logoImg} alt="Letmeask"/>
                    <button onClick={handleCreateRoom} className='create-room'>
                        <img src={googleIconImg} alt="Logo da Google"/>
                        Cria sua sala com o Google
                    </button>
                    <div className='separator'>ou entre em uma sala</div>
                    <form>
                        <input 
                            type="text"
                            placeholder="Digite o código da sala"
                        />
                        <Button type="submit">
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    );
}