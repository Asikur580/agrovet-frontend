//___ Css ___//
import "./ToDoApp.css";

//___ Images ___//
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import { IoTrashBinSharp } from "react-icons/io5";

const ToDo_Items = (props) => {
  const { id, text, isComplete, deleteTodo, toggleTodo } = props;

  return (
    <div className="ToDo_Items">
      <div onClick={() => toggleTodo(id)} className="toDoOnlyOneItems">
        <div style={{ width: "30px" }}>
          {isComplete ? <RxCross2 /> : <TiTick />}
        </div>
        <p className={`${isComplete ? "line-throw" : ""}`}>{text}</p>
      </div>
      <IoTrashBinSharp
        onClick={() => deleteTodo(id)}
        style={{ cursor: "pointer" }}
      />
    </div>
  );
};

export default ToDo_Items;
