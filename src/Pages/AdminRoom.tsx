import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode} from '../components/RoomCode';
import { useRoom } from '../hooks/useRoom';
import { database, ref, remove, update, get } from '../services/firebase';
import deleteImg from '../assets/images/delete.svg';
import logoImg from '../assets/images/logo.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

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

    async function handleCheckQuestionAsAnswered(questionId: string) {
        const roomRef = await get(ref(database, `rooms/${roomId}/questions/${questionId}`));
        await update(ref(database,`rooms/${roomId}/questions/${questionId}`), {
            isAnswered: !roomRef.val().isAnswered,
        });
    };

    async function handleHighlightQuestion(questionId: string) {
        const roomRef = await get(ref(database, `rooms/${roomId}/questions/${questionId}`));
        await update(ref(database,`rooms/${roomId}/questions/${questionId}`), {
            isHighlighted: !roomRef.val().isHighlighted,
        });
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
                            isAnswered={question.isAnswered}
                            isHighlighted={question.isHighlighted}
                            >
                                <button
                                type='button'
                                onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                >
                                    <img src={checkImg} alt="Marcar pergunta pergunta como respondida"/>
                                </button>

                                <button
                                type='button'
                                onClick={() => handleHighlightQuestion(question.id)}
                                >
                                    <img src={answerImg} alt="Dar destaque a pergunta"/>
                                </button>

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