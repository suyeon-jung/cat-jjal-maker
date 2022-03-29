import React from 'react';
import logo from './logo.svg';
import './App.css';
import Title from "./components/Title"

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};


const Form = ({ updateMainCat }) => {

  const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);
  const [value, setValue] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  function handleInputChange(e) {
    const userValue = e.target.value;

    setErrorMessage('');
    if (includesHangul(userValue)) setErrorMessage("한글은 입력할 수 없습니다.");

    setValue(userValue.toUpperCase());
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    setErrorMessage('');
    if (value === '') { setErrorMessage('빈 값으로 만들 수 없습니다.'); return; }
    updateMainCat(value);
  }

  return (<form onSubmit={handleFormSubmit}>
    <input type="text" name="name" placeholder="영어 대사를 입력해주세요" value={value} onChange={handleInputChange} />
    <button type="submit">생성</button>
    <p style={{ color: 'red' }}>{errorMessage}</p>
  </form>)
}

function CatItem(props) {
  return (<li>
    <img src={props.img} style={{ width: "150px" }} />
  </li>);
}


function Favorites({ favorites }) {
  if (favorites.length === 0)
    return (<div>사진 위 하트를 눌러 고양이 사진을 저장해봐요!</div>)
  return (
    <ul className="favorites">
      {favorites.map(cat => <CatItem img={cat} key={cat} />)}
    </ul>
  )
}


// 화살표 함수
const MainCard = ({ img, alreadyFavorite, onHeartClick }) => {
  const heartIcon = alreadyFavorite ? "💖" : "🤍";
  return (<div className="main-card">
    <img src={img} alt="고양이" width="400" />
    <button onClick={onHeartClick}>{heartIcon}</button>
  </div>)
}


const App = () => {
  const CAT1 = "https://cataas.com/cat/60b73094e04e18001194a309/says/react";
  const CAT2 = "https://cataas.com//cat/5e9970351b7a400011744233/says/inflearn";
  const CAT3 = "https://cataas.com/cat/595f280b557291a9750ebf65/says/JavaScript";


  // 생성할 때마다 counter 변수 +1
  const [mainCat, setMainCat] = React.useState(CAT1);
  const [favorites, setFavorites] = React.useState(() => {
    return (jsonLocalStorage.getItem('favorites') || []);
  });
  // 불필요하게 로컬스토리지에 접근하지 않는 코드
  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem('counter');
  })

  const alreadyFavorite = favorites.includes(mainCat);
  const counterTitle = counter === null ? "" : counter + "번째";

  async function setInitialCat() {
    const newCat = await fetchCat('First cat');
    console.log("new cat");
    setMainCat(newCat);

  }

  React.useEffect(() => {
    setInitialCat();
  }, [])


  async function updateMainCat(value) {
    const newCat = await fetchCat(value);

    setMainCat(newCat);
    setCounter((prev) => {
      const nxtCounter = prev + 1;
      jsonLocalStorage.setItem('counter', nxtCounter);
      return nxtCounter;
    })
  }

  function handleHeartClick() {
    const nxtFavorites = [...favorites, mainCat];
    setFavorites(nxtFavorites);
    jsonLocalStorage.setItem('favorites', nxtFavorites);
  }

  return (
    <div>
      <Title>{counterTitle} 고양이 가라사대</Title><Form updateMainCat={updateMainCat} />
      <MainCard img={mainCat} alreadyFavorite={alreadyFavorite} onHeartClick={handleHeartClick} /><Favorites favorites={favorites} />
    </div>
  );
}

export default App;
