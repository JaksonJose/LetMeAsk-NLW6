import { useState, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import illustration from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../component/Button';
import '../styles/auth.scss';


export function NewRoom(){
  const { user } = useAuth();
  const history = useHistory();
  const [newRoom, setNewRoom] = useState('');

  async function HandleCreateRoom(event: FormEvent) {
    event.preventDefault();
    
    /* This prevent creating room with spaces */
    if (newRoom.trim() === '') {
      return;
    }

    const roomRef = database.ref('rooms');

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    });

    history.push(`/rooms/${firebaseRoom.key}`);

  }

  return(
    <div id="page-auth">
      <aside>
        <img src={illustration} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência ao vivo </p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="" />
          <h1>{user?.name}</h1>
          <h2>Criar uma nova sala</h2>
          <form onSubmit={HandleCreateRoom}>
            <input type="text" placeholder="Nome da sala"  value={newRoom}
            onChange={event => setNewRoom(event.target.value)}/>
            <Button type="submit">Criar sala</Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  )
}