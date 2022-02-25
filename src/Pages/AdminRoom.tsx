import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode} from '../components/RoomCode';
import { useRoom } from '../hooks/useRoom';
import { database, ref, remove, update } from '../services/firebase';
import deleteImg from '../assets/images/delete.svg';
import logoImg from '../assets/images/logo.svg';

import '../styles/room.scss'

type RoomParams = {
    id: string,
};

export function AdminRoom() {
    //const { user } = useAuth();
    const navigate = useNavigate();
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const { questions, title } = useRoom(roomId!);

    async function handleEndRoom() {
        await update(ref(database, `rooms/${roomId}`), {
            endedAt: new Date(),
        });

        navigate('/');
    };

    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm('Tem certeza que deseja excluit esta pergunta?')) {
            await remove(ref(database,`rooms/${roomId}/questions/${questionId}`));
        }
    };

    return (
        <div id='page-room'>
            <header>
                <div className='content'>
                    <img src={logoImg} alt='Letmeask'/>
                    <div>
                        <RoomCode code={roomId!}/>
                        <Button 
                        isOutlined={true}
                        onClick={handleEndRoom}
                        >
                            Encerrar Sala
                        </Button>
                    </div>
                </div>
            </header>
            <main>
                <div className='room-title'>
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && (
                        <span>{questions.length} pergunta(s)</span>
                    )}
                </div>
                <div className='question-list'>
                    {questions.map(question => {
                        return (
                            <Question 
                            key={question.id}
                            content={question.content}
                            author={question.author}
                            >
                                <button
                                type='button'
                                onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="Remover pergunta"/>
                                </button>
                            </Question>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}