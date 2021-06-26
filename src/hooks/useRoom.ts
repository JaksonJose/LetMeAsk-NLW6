import { useEffect, useState } from "react";
import { isCallLikeExpression } from "typescript";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";


type FirebaseQuestions = Record<string, {
  author: {
    name: string,
    avatar: string
  };
  content: string;
  isHighlighted: boolean;
  isAnswered: boolean;
  likes: Record<string, { authorId: string }>;
}>

type QuestionType = {
  id: string;
  author: {
    name: string,
    avatar: string
  };
  content: string;
  isHighlighted: boolean;
  isAnswered: boolean;
  likeCount: number;
  likeId: string | undefined;
}

/* Load the questions list */
export function useRoom(roomId: string) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);
    
    roomRef.on('value', room => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

      /* Convert Object in Array */
      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
          likeCount: Object.values(value.likes ?? {}).length,
          /* if find method do not find anything, it returns Null. If it finds somethings it access poisition 0 */
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id )?.[0],
        }
      })

      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);

    })

    return () => {
      roomRef.off('value');
    }

  }, [roomId, user?.id])


  return { questions, title }
}