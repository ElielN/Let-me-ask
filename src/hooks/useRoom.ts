import { useEffect, useState } from 'react';
import { database, onValue, ref, off } from '../services/firebase';
import { useAuth } from './useAuth';

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
    likes: Record<string,{
        authorId: string,
    }>
}>

type QuestionParams = {
    id: string,
    author: {
        name: string,
        avatar: string,
    },
    content: string,
    isAnswered: boolean,
    isHighlighted: boolean,
    likeCount: number,
    likeId: string | undefined,
}

export function useRoom (roomId: string) {
    const { user } = useAuth();
    const [questions, setQuestions] = useState<QuestionParams[]>([]);
    const [title, setTitle] = useState('');

    useEffect(() => {
        const roomRef = ref(database, `rooms/${roomId}`);
        // onValue é um listener que irá ouvir mudanças no roomRef em tempo real
        onValue(roomRef, (room) => {
            const databaseRoom = room.val();
            const firebaseQuestions = (databaseRoom.questions ?? {}) as FirebaseQuestions;
            // Os dados do firebase são puxados como objetos. Usamos um map para pegar cada conjunto chave/valor
            // Essa const está recebendo todos os dados de uma pergunta
            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                    // Caso exista, obtemos o número de likes de uma pergunta
                    likeCount: Object.values(value.likes ?? {}).length,
                    // Verifica se o user já deu like na pergunta
                    // Verifica se a pergunta tem likes. Se sim, então tenta encontrar o like do usuário. Se encontrar, retorna o id desse like
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
                }
            });
            
            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions);
        });
        // Remove todos os event listeners associados a essa referência
        // Isso é feito para o listener não ficar ativo mesmo depois de mudarmos a página, por exemplo
        return () => {
            off(roomRef);
        };

    }, [roomId, user?.id]);

    return { questions, title };
};