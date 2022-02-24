import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { RoomCode} from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { ref, database, push, onValue } from '../services/firebase';
import '../styles/room.scss'

// O nosso snapshot room é um objeto onde a primeira chave é uma string e a segunda é outro objeto
// No typescript podemos usar o Record para representar um objeto
// No segundo parâmetro desse objeto poderíamos usar Record novamente mas nós iremos usar {} pois
// sabemos os campos que compôes esse objeto
type FirebaseQuestions = Record<string, {
    author: {
        name: string,
        avatar: string,
    },
    content: string,
    isAnswered: boolean,
    isHighlighted: boolean,
}>

type Question = {
    id: string,
    author: {
        name: string,
        avatar: string,
    },
    content: string,
    isAnswered: boolean,
    isHighlighted: boolean,
}

type RoomParams = {
    id: string,
};

export function Room() {
    const { user } = useAuth();
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const [newQuestion, setNewQuestion] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [title, setTitle] = useState('');

    useEffect(() => {
        const roomRef = ref(database, `rooms/${roomId}`);
        // onValue é um listener que irá ouvir mudanças no roomRef em tempo real
        onValue(roomRef, (room) => {
            const databaseRoom = room.val();
            const firebaseQuestions = (databaseRoom.questions ?? {}) as FirebaseQuestions;
            // Os dados do firebase são puxados como objetos. Usamos um map para pegar cada conjunto chave/valor
            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered
                }
            });
            
            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions);
        });
        /*roomRef.once('value', room => {
            console.log(room.val());
        }); */

    }, [roomId]);

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

    return (
        <div id='page-room'>
            <header>
                <div className='content'>
                    <img src={logoImg} alt='Letmeask'/>
                    <RoomCode code={roomId!}/>
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
                {JSON.stringify(questions)}
            </main>
        </div>
    );
}