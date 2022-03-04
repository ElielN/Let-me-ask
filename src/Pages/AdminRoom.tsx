import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode} from '../components/RoomCode';
import { useRoom } from '../hooks/useRoom';
import { database, ref, remove, update, get, push } from '../services/firebase';
import { ThemeContext } from 'styled-components';
import { FormEvent, useContext, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Switch from 'react-switch';

import deleteImg from '../assets/images/delete.svg';
import logoImg from '../assets/images/logo.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import moonIcon from '../assets/images/moonIcon.png';
import sunIcon from '../assets/images/sunIcon.png';

import '../styles/room.scss';

type RoomParams = {
    id: string,
};

type Props = {
    toggleTheme(): void;
};

export function AdminRoom({toggleTheme}: Props) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const [newQuestion, setNewQuestion] = useState('');
    //const [userIsAdmin, setUserIsAdmin] = useState(true);
    const { questions, title } = useRoom(roomId!);
    const { colors, themeTitle } = useContext(ThemeContext);

    async function handleEndRoom() {
        if(await handleVerifyRoomAdmin(user!.id)){
            await update(ref(database, `rooms/${roomId}`), {
                endedAt: new Date(),
            });
    
            navigate('/');
        }
    };

    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault();

        if(newQuestion.trim() === ''){
            return;
        }

        if(!user){
            throw new Error('You must be logged in');
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar
            },
            isHighlighted: false,
            isAnswered: false,
        };

        await push(ref(database, `rooms/${roomId}/questions`),question);

        setNewQuestion('');
    };

    async function handleDeleteQuestion(questionId: string) {
        if(await handleVerifyRoomAdmin(user!.id)){
            if (window.confirm('Tem certeza que deseja excluir esta pergunta?')) {
                await remove(ref(database,`rooms/${roomId}/questions/${questionId}`));
            }
        }
    };

    async function handleCheckQuestionAsAnswered(questionId: string) {
        if(await handleVerifyRoomAdmin(user!.id)){
            const roomRef = await get(ref(database, `rooms/${roomId}/questions/${questionId}`));
            await update(ref(database,`rooms/${roomId}/questions/${questionId}`), {
                isAnswered: !roomRef.val().isAnswered,
            });
        }
    };

    async function handleHighlightQuestion(questionId: string) {
        if(await handleVerifyRoomAdmin(user!.id)){
            const roomRef = await get(ref(database, `rooms/${roomId}/questions/${questionId}`));
            await update(ref(database,`rooms/${roomId}/questions/${questionId}`), {
                isHighlighted: !roomRef.val().isHighlighted,
            });
        }
    };

    async function handleVerifyRoomAdmin(userId: string): Promise<boolean> {
        const roomRef = await get(ref(database, `rooms/${roomId}`));
        if(userId !== roomRef.val().authorId) {
            window.alert('Você não é o administrador desta sala!');
            return false;
        } else {
            return true;
        }
    };

    return (
        <div id='page-room'>
            <header>
                <div className='content'>
                    <img src={logoImg} alt='Letmeask'/>
                    <div>
                        {themeTitle === 'dark' ? 
                        (<img src={moonIcon} alt='modo dark'/>) 
                        : 
                        (<img src={sunIcon} alt='modo light'/>)
                        }
                        <Switch 
                            onChange={toggleTheme}
                            checked={themeTitle === 'dark'}
                            checkedIcon={false}
                            uncheckedIcon={false}
                            height={10}
                            width={40}
                            handleDiameter={20}
                            onHandleColor='#fff'
                            offHandleColor='#835afd'
                            offColor='#555'
                            onColor='#835afd'
                        />
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

                <form onSubmit={handleSendQuestion}>
                    <textarea 
                    placeholder='O que você quer perguntar?'
                    onChange={event => setNewQuestion(event.target.value)}
                    value={newQuestion}
                    />
                    <div className='form-footer'>
                        { user ? (
                            <div className='user-info'>
                                <img src={user.avatar} alt={user.name}/>
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
                        )}
                        <Button type='submit' disabled={!user}>Enviar pergunta</Button>
                    </div>
                </form>

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