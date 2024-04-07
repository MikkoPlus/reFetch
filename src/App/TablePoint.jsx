import React, { useEffect, useState } from "react";

const TablePoint = ({ hostName, ip, needReFetch }) => {
  const [currentStatusCode, setCurrentStatusCode] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const reFetchStatus = () => {
    setIsPending(true);
    return fetch(hostName)
      .then((response) => {
        setCurrentStatusCode(response.status);
      })
      .finally(() => setIsPending(false));
  };

  // Эффект очистки статус кода при новом запросе
  useEffect(() => {
    if (isPending) {
      setCurrentStatusCode(null);
    }
  }, [isPending]);

  // При изменении стейта родительского компонента(каждые 15 минут) вызывается функция получения статус кода
  useEffect(() => {
    reFetchStatus();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needReFetch]);

  return (
    <div className="table_point">
      <p>{hostName}</p>
      <p>{ip}</p>
      <p>{currentStatusCode ?? "...Ожидание ответа"}</p>
    </div>
  );
};

export default TablePoint;
