import { useNavigate } from 'react-router-dom';
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';
import '../styles/auth.scss';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth' // Hook para fazer a importação do useCOntext e useAuth ao mesmo tempo
import { FormEvent, useState } from 'react';
import { ref, database, get} from '../services/firebase';

export function Home() {
    // useNavigate é um hook de navegação entre telas
    // usamos ele em conjunto com uma função. Quando chamada, ela irá direcionar
    // para a página passada para navigate
    const navigate = useNavigate();
    const { user, singInWithGoogle } = useAuth();
    const [roomCode, setRoomCode] = useState('');

    async function handleCreateRoom() {
        // Se o usuário não estiver autenticado
        if(!user) { 
            await singInWithGoogle();
        }

        navigate('/rooms/new');
    };

    // Função para entrar em uma sala existente
    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();

        // Se o usuário não digitou nada, não ocorre nada
        if(roomCode.trim() === '') {
            return;
        }

        // Busca pelos dados de uma sala específica (se existir)
        const roomRef = await get(ref(database, `rooms/${roomCode}`));

        // Verifica se a sala existe
        if(!roomRef.exists()){
            alert('Room does not exists.');
            return;
        }

        // Se a sala existe, redirecionamos para ela
        navigate(`rooms/${roomCode}`);

    };

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
                    <form onSubmit={handleJoinRoom}>
                        <input 
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
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