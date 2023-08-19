import React from "react";
import Player from "@/components/player";

const DashboardPage = () => {
  // const [socket, setSocket] = useState();

  // useEffect(() => {
  //   const s = io("http://localhost:5001");
  //   setSocket(s);
  //   return () => {
  //     s.disconnect();
  //   };
  // }, []);

  // useEffect(() => {
  //   const asyncHelper = async () => {
  //        fetch(`http://localhost:5001/song/zytdU8haHlQ`)
  //         .then((res) => res.json())
  //         .then((result) => {
  //           setInfo(result.data);
  //         });
  //    };

  //   asyncHelper();
  // }, []);

  // useEffect(() => {
  //   if (socket == null) return;
  //   socket.on("receive-change-song", (song) => {
  //     setInfo(song);
  //   });
  // }, [socket]);

  // useEffect(() => {
  //   if (socket == null) return;

  //   socket.once("load-room", (id) => {
  //     console.log(id);
  //   });

  //   socket.emit("get-room", id);
  // }, [socket, id]);

  return (
    <div className="screen-container">
      <Player videoId={"2Vv-BfVoq4g"} />
    </div>
  );
};

export default DashboardPage;
