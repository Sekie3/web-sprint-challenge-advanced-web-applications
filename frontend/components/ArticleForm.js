import React, { useEffect, useState } from 'react'
import PT from 'prop-types'

const initialFormValues = { title: '', text: '', topic: '' }

export default function ArticleForm(props) {
  const [values, setValues] = useState(initialFormValues)
  // ✨ where are my props? Destructure them here
  const { postArticle, updateArticle, setCurrentArticleId, currentArticle } = props;


  useEffect(() => {
  if (currentArticle) {
    setValues({
      title: currentArticle.title,
      text: currentArticle.text,
      topic: currentArticle.topic,
    });
  } else {
    setValues(initialFormValues);
  }
}, [currentArticle]);


  const onChange = evt => {
    const { id, value } = evt.target
    setValues({ ...values, [id]: value })
  }

  const onSubmit = async evt => {
    evt.preventDefault();
    var valueHolder = values;
    setValues(initialFormValues);
  
    if (currentArticle) {
       await updateArticle({ article_id: currentArticle.article_id, article: valueHolder });
       setCurrentArticleId(null); 
    } else {
       await postArticle(valueHolder);
    }
};

const onCancelEdit = evt => {
    evt.preventDefault(); 
    setCurrentArticleId(null); 
    setValues(initialFormValues); 
};
  
  

  const isDisabled = () => {
    return !(values.title && values.text && values.topic);
  };
  

  return (
    // ✨ fix the JSX: make the heading display either "Edit" or "Create"
    // and replace Function.prototype with the correct function
    <form id="form" onSubmit={onSubmit}>
      <h2>{currentArticle ? "Edit Article" : "Create Article"}</h2>
      <input
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button disabled={isDisabled()} id="submitArticle">Submit</button>
        <button onClick={Function.prototype}>Cancel edit</button>
      </div>
    </form>
  )
}

// 🔥 No touchy: LoginForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({ // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })
}
