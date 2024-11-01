const http = require("http");

let todo = [
  { id: 1, content: "더미데이터" },
  { id: 2, content: "터미네이터" },
];

const server = http.createServer((req, res) => {
  // setHeader값을 이렇게 쓰면 한국어 안깨지고 가능
  console.log(req.method + "요청이 들어왔어요!");

  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS,GET,POST,PUT,DELETE");
  //preflight 요청 처리
  if (req.method === "OPTIONS") {
    return res.end("요청 보내세요.");
  }
  //GET
  if (req.method === "GET") {
    // 참조자료형은 JSON 형태의 문자열로 보내야 합니다.
    return res.end(JSON.stringify(todo));
  }
  //POST
  if (req.method === "POST") {
    let data;
    //'data'가 들어오는 이벤트가 발생하면
    req.on("data", (chunk) => {
      //데이터를 받아온다.
      data = chunk.toString();
    });

    //데이터를 다 받아오고 나면
    req.on("end", () => {
      const newTodo = { id: Number(new Date()), content: data };
      todo.push(newTodo);
    });
    return res.end("Todo가 추가 됐습니다.");
  }

  //PUT
  if (req.method === "PUT") {
    let data;
    req.on("data", (chunk) => {
      data = chunk.toString();
    });
    req.on("end", () => {
      const newTodo = JSON.parse(data);
      todo = todo.map((el) => {
        if (el.id === newTodo.id) {
          return newTodo;
        } else {
          return el;
        }
      });
    });
    return res.end("Todo가 수정됐습니다.");
  }
  //DELETE 요청 거리
  if (req.method === "DELETE") {
    let data;
    req.on("data", (chunk) => {
      data = chunk.toString();
    });
    req.on("end", () => {
      const id = Number(data);
      todo = todo.filter((el) => el.id !== id);
    });
    return res.end("Todo가 삭제됐습니다.");
  }
  return res.end("end");
});

//만든 서버 열기
server.listen(3000, () => {
  console.log("서버가 열렸어요");
});
