import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)
  const [username, setUsername] = useState('');


  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => {
    navigate("/");
  }
  
  const redirectToArticles = () => {
    navigate("/articles");
  }
  

  const logout = () => {
    localStorage.removeItem('token');
    setMessage("Goodbye!");
    redirectToLogin();
  }
  

  const login = async ({ username, password }) => {
    setMessage("");
    setSpinnerOn(true);
    
    try {
      const response = await axios.post(loginUrl, { username, password });
      console.log(username)
      localStorage.setItem('token', response.data.token);
      setMessage(response.data.message);
      
      setUsername(username);

      redirectToArticles();
    } catch (error) {
      setMessage("Login failed");
    } finally {
      setSpinnerOn(false);
    }
}

  

  const getArticles = async () => {
    setMessage("");
    setSpinnerOn(true);
    
    try {
      const response = await axios.get(articlesUrl, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });
      setArticles(response.data.articles);
      setMessage(response.data.message);
    } catch (error) {
      if (error.response.status === 401) {
        redirectToLogin();
      } else {
        setMessage("Failed to fetch articles");
      }
    } finally {
      setSpinnerOn(false);
    }
  }
  

  const postArticle = async article => {
    setMessage("");
    setSpinnerOn(true);
    
    try {
      const response = await axios.post(articlesUrl, article, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });
      if (response.status === 201) {
        setArticles(prevArticles => [...prevArticles, response.data.article]);
        setMessage(response.data.message);
      } else {
        setMessage("Failed to post article");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        redirectToLogin();
      } else {
        setMessage("Failed to post article");
      }
    } finally {
      setSpinnerOn(false);
    }
  }
  

  const updateArticle = async ({ article_id, article }) => {
    setMessage("");
    setSpinnerOn(true);
    
    try {
      const response = await axios.put(`${articlesUrl}/${article_id}`, article, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });
      
      if (response.status === 200) {
        const updatedArticles = articles.map(art => 
          art.article_id === article_id ? response.data.article : art
        );
        setArticles(updatedArticles);
        setMessage(`Nice update, ${username}!`);
      } else {
        setMessage("Failed to update article");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        redirectToLogin();
      } else {
        setMessage("Failed to update article");
      }
    } finally {
      setSpinnerOn(false);
    }
  }
  

  const deleteArticle = async article_id => {
    setMessage("");
    setSpinnerOn(true);
    
    try {
      const response = await axios.delete(`${articlesUrl}/${article_id}`, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });
      
      if (response.status === 200) {
        const remainingArticles = articles.filter(art => art.article_id !== article_id);
        setArticles(remainingArticles);
        setMessage(`Article ${article_id} was deleted, ${username}!`);
      } else {
        setMessage("Failed to delete article");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        redirectToLogin();
      } else {
        setMessage("Failed to delete article");
      }
    } finally {
      setSpinnerOn(false);
    }
  }
  

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn}/>
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
        <Route path="/" element={<LoginForm login={login} setUsername={setUsername} />} />
          <Route path="articles" element={
            <>
              <ArticleForm 
                postArticle={postArticle}
                updateArticle={updateArticle}
                setCurrentArticleId={setCurrentArticleId}
                currentArticle={articles.find(art => art.article_id === currentArticleId)}
              />
              <Articles 
                articles={articles}
                getArticles={getArticles}
                deleteArticle={deleteArticle}
                setCurrentArticleId={setCurrentArticleId}
                currentArticleId={currentArticleId}
              />
            </>
          } />
        </Routes>

        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
