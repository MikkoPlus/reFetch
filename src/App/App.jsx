import React, { useEffect, useState } from "react";
import "./App.css";
import TablePoint from "./TablePoint.jsx";

const App = () => {
  const [hosts, setHosts] = useState([]);
  const [date, setDate] = useState("");
  const [reFetch, setReFetch] = useState(false);

  // Функция форматирования времени
  const formatCurrentDate = (date) => {
    const formatNumWithZero = (num) => {
      if (num < 10) {
        return `0${num}`;
      } else {
        return num;
      }
    };
    const currentDate = formatNumWithZero(date.getDate());
    const currentMonth = formatNumWithZero(date.getMonth() + 1);

    return `${currentDate}.${currentMonth}.${date.getFullYear()}, ${formatNumWithZero(
      date.getHours()
    )}:${formatNumWithZero(date.getMinutes())}:${formatNumWithZero(
      date.getSeconds()
    )}`;
  };

  useEffect(() => {
    // Запрос данных из файла hostsInfo.json (имитация запроса к серверу) для получения адрессов, от которых нужно получать код ответа
    fetch("data/hostsInfo.json", {
      method: "GET",
      // Устанавливая заголовки для получения ответа в формате JSON
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          // Ошибка, если список хостов не получен
          throw new Error("data is not exist");
        }
      })
      .then((data) => {
        // Получаем массив хостов и записываем его в стейт
        setHosts(data.hosts);
      });
  }, []);

  useEffect(() => {
    // Устанавливает текущую дату и время при заходе на страницу и запускает первый запрос для получения статуса ответа
    const dateNow = new Date();
    setDate(formatCurrentDate(dateNow));
    setReFetch(true);
  }, []);

  useEffect(() => {
    //Запускает интервал с временем в мс
    const reFetchInterval = setInterval(() => {
      setReFetch(!reFetch);
      const currentDate = new Date();
      setDate(formatCurrentDate(currentDate));
      // 900000 - интервал в 15 минут
    }, 900000);
    //Отчищает интервал при размонтировании компонента
    return () => clearInterval(reFetchInterval);
  }, [reFetch]);

  return (
    <div className="App">
      <div className="table">
        <h1>Домены в файле hosts</h1>
        <div className="table_container">
          <div className="table_point">
            <h2>host name</h2>
            <h2>IP</h2>
            <h2>StatusCode</h2>
          </div>

          {/* Выводим массив проверяемых хостов */}
          {hosts.length !== 0 &&
            hosts.map((host, index) => {
              const { hostName, ip } = host;
              // проверки на существования данных, если параметр отсутствует, то компонент не будет отрендерен
              return (
                host &&
                hostName &&
                ip && (
                  <TablePoint
                    hostName={hostName}
                    ip={ip}
                    key={index}
                    needReFetch={reFetch}
                  />
                )
              );
            })}
        </div>
        {/* Устанавливаем дату и время последнего к серверу  */}
        <p>{date}</p>
      </div>
    </div>
  );
};

export default App;
