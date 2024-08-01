import Post from '../../components/Post';

export default function Home() {
  return (
    <div className="home">
      <div className="posts-container">
        <Post
          postId={'123'}
          author={'post author'}
          textContent={
            'Lorem ipsum, dolor sit amet conse. Saepe optio minus rem dolor sit amet!'
          }
        />
        <Post
          postId={'123'}
          author={'post author'}
          textContent={
            'Lorem ipsum, dolor sit amet conse. Saepe optio minus rem dolor sit amet!'
          }
        />
        <Post
          postId={'123'}
          author={'post author'}
          textContent={
            'Lorem ipsum, dolor sit amet conse. Saepe optio minus rem dolor sit amet!'
          }
        />
        <Post
          postId={'123'}
          author={'post author'}
          textContent={
            'Lorem ipsum, dolor sit amet conse. Saepe optio minus rem dolor sit amet!'
          }
        />
        <Post
          postId={'123'}
          author={'post author'}
          textContent={
            'Lorem ipsum, dolor sit amet conse. Saepe optio minus rem dolor sit amet!'
          }
        />
      </div>
    </div>
  );
}
