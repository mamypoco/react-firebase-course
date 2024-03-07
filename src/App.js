import "./App.css";
import { Auth } from "./components/auth";
import { db, auth, storage } from "./config/firebase";
import { useState, useEffect } from "react";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

function App() {
  const [movieList, setMovieList] = useState([]);

  //New movie states
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newMovieReleasedDate, setNewMovieReleasedDate] = useState(0);
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false);
  //Update title state
  const [updatedTitle, setUpdatedTitle] = useState("");
  //File upload state
  const [fileUpload, setFileUpload] = useState(null);

  const moviesCollectionRef = collection(db, "movies");

  //retrieve all movies
  const getMovieList = async () => {
    try {
      const data = await getDocs(moviesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMovieList(filteredData);
    } catch (err) {
      console.error(err);
    }
  };
  //delete movie
  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await deleteDoc(movieDoc);
    getMovieList();
  };
  //update movie title
  const updateMovieTitle = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await updateDoc(movieDoc, { title: updatedTitle });
    getMovieList();
  };
  //create new movie
  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseDate: newMovieReleasedDate,
        receivedAnOscar: isNewMovieOscar,
        userId: auth?.currentUser.uid,
      });
      getMovieList(); //whenever movie list submit went successful
    } catch (err) {
      console.error(err);
    }
  };
  //it retrieves all movies
  useEffect(() => {
    getMovieList(); //call the function
  }, []);

  const uploadFile = async () => {
    if (!fileUpload) return;
    const fileFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);

    try {
      await uploadBytes(fileFolderRef, fileUpload);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="App">
      <Auth />
      <div>
        <input
          placeholder="Movie title"
          onChange={(e) => setNewMovieTitle(e.target.value)}
        />
        <input
          placeholder="Released Year"
          type="number"
          onChange={(e) => setNewMovieReleasedDate(Number(e.target.value))}
        />
        <input
          type="checkbox"
          checked={isNewMovieOscar}
          onChange={(e) => setIsNewMovieOscar(e.target.checked)}
        />
        <label>Received an Oscar?</label>
        <button onClick={onSubmitMovie}>Submit Movie</button>
      </div>
      <div>
        {movieList.map((movie) => (
          <div>
            <h1 style={{ color: movie.receivedAnOscar ? "green" : "orange" }}>
              {movie.title}
            </h1>
            <p>Released Year: {movie.releaseDate}</p>
            <button onClick={() => deleteMovie(movie.id)}>Delete Movie</button>

            <input
              placeholder="new title"
              onChange={(e) => setUpdatedTitle(e.target.value)}
              type="text"
            />
            <button onClick={() => updateMovieTitle(movie.id)}>
              Update Title
            </button>
          </div>
        ))}
      </div>
      <div>
        <input type="file" onChange={(e) => setFileUpload(e.target.files[0])} />
        <button onClick={uploadFile}>Upload File</button>
      </div>
    </div>
  );
}

export default App;
