import { Link, useNavigate } from 'react-router-dom';
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import '../styles/auth.scss';
import { Button } from '../components/Button';
import { FormEvent, useState } from 'react';
import { database, ref, push } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
// import { useAuth } from '../hooks/useAuth';

export function NewRoom() {
    const { user } = useAuth();

    const navigate = useNavigate();

    const [newRoom, setNewRoom] = useState('');

    // Uma função que é passada para um elemento nativo HTML pode receber o próprio
    // evento como parâmetro para podermos ver/manipular esse evento
    async function handleCreateRoom(event: FormEvent) {
        // Previne o comportamento padrão do form de atualizar a página quando ocorre o onSubmit
        event.preventDefault();

        // Verifica se está tentando criar uma sala sem nome
        // trim remove os espaços em branco na string
        if(newRoom.trim() === ''){
            return;
        }

        // Referência para um registro de dado no Firebase
        const roomRef = ref(database,'rooms');

        const firebaseRoom = await push(roomRef,{
            title: newRoom,
            authorId: user?.id,
        });

        // O push me retorna uma key (um id único) que iremos usar para identificar cada sala
        // O navigate nos direciona para a sala que acaba de ser criada
        navigate(`/admin/rooms/${firebaseRoom.key}`);
    }

    // <aside> será a área colorida na lateral esquerda
    // <main> será a área principal ao lado direito
    // <Link> vem da biblioteca react-router-dom que estamos usando para criar rotas entre as pages,
    // ele pode ser usado como se fosse uma âncora <a>

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
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input 
                            type="text"
                            placeholder="Nome da sala"
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}
                        />
                        <Button type="submit">
                            Criar sala
                        </Button>
                    </form>
                    <p>
                        Quer entrar em uma sala existente? <Link to="/">clique aqui</Link>
                    </p>
                </div>
            </main>
        </div>
    );
}