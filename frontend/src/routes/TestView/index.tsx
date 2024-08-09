import { toast, Slide } from 'react-toastify';

// https://fkhadra.github.io/react-toastify/introduction

export default function TestView() {
  function notify() {
    toast('🦄 Wow so easy!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'dark',
      transition: Slide,
    });
  }

  return (
    <>
      <div className="container fullscreen background-black text-white">
        <button className="p-4 border-2 rounded-md" onClick={notify}>
          Notify
        </button>
      </div>
    </>
  );
}
