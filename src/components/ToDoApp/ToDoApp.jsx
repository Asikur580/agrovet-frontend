import React, { useEffect, useRef, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import ToDo_Items from "./ToDo_Items";
import useEscapeKey from "../../hooks/useEscapeKey";

//=>>> Icons
import { LuExpand } from "react-icons/lu";
import { FaRegCalendarPlus, FaMinus } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";

//=>>> Css
import "./ToDoApp.css";

const ToDoApp = () => {
  const [activeCalculator, setActivCalculator] = useState(0);

  const handleActive = () => {
    setActivCalculator((prev) => (prev = 1));
    setToDoList(
      sessionStorage.getItem("ToDos")
        ? JSON.parse(sessionStorage.getItem("ToDos"))
        : []
    );
  };

  const handleMaximize = () => {
    setActivCalculator((prev) => (prev = 2));
  };

  const handleMinimize = () => {
    setActivCalculator((prev) => (prev = 3));
  };

  const handleClose = () => {
    setActivCalculator((prev) => (prev = 0));
  };
  useEscapeKey(() => setActivCalculator((prev) => (prev = 0)));

  const inputRef = useRef();
  const [toDoList, setToDoList] = useState(
    sessionStorage.getItem("ToDos")
      ? JSON.parse(sessionStorage.getItem("ToDos"))
      : []
  );

  const Add = () => {
    const inputTxt = inputRef.current.value.trim();
    if (inputTxt === "") {
      return null;
    }
    const newToDo = {
      id: Date.now(),
      text: inputTxt,
      isComplete: false,
    };
    setToDoList((prev) => [...prev, newToDo]);
    inputRef.current.value = "";
  };

  const deleteTodo = (id) => {
    const confirmation = confirm("Do you want to delete this task?");
    if (confirmation) {
      setToDoList((prev) => {
        return prev.filter((todo) => todo.id !== id);
      });
    }
  };

  const toggleTodo = (id) => {
    setToDoList((prev) => {
      return prev.map((todo) => {
        if (todo.id === id) {
          return { ...todo, isComplete: !todo.isComplete };
        }
        return todo;
      });
    });
  };

  useEffect(() => {
    sessionStorage.setItem("ToDos", JSON.stringify(toDoList));
  }, [toDoList]);

  return (
    <div className="ToDoApp no-print">
      <Tooltip title="ToDo App">
        <div className="iconBox" onClick={handleActive}>
          <FaRegCalendarPlus size={25} />
        </div>
      </Tooltip>

      <div
        className={(() => {
          if (activeCalculator == 1) {
            return "active toDoAppBox";
          } else if (activeCalculator == 2) {
            return "fullWidth toDoAppBox";
          } else if (activeCalculator == 3) {
            return "active toDoAppBox";
          } else {
            return "toDoAppBox";
          }
        })()}
      >
        <div className="closeIcon">
          <LuExpand size={15} className="icon" onClick={handleMaximize} />
          <FaMinus size={15} className="icon" onClick={handleMinimize} />
          <RxCross1 size={15} className="icon" onClick={handleClose} />
        </div>

        <div className="todoBox">
          <div className="addTaskBox">
            <div className="head">
              <div>
                <FaRegCalendarPlus size={20} />
              </div>
              <div>
                <h3 className="toDoTitle">Tasks</h3>
              </div>
            </div>
            <div className="addTask">
              <input type="text" ref={inputRef} placeholder="Add your task" />
              <button onClick={Add}>Add</button>
            </div>
          </div>
          <div>
            {toDoList.map((items, index) => {
              return (
                <ToDo_Items
                  key={index}
                  id={items.id}
                  text={items.text}
                  isComplete={items.isComplete}
                  deleteTodo={deleteTodo}
                  toggleTodo={toggleTodo}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToDoApp;

/***
 * Backup data
 * Data 1
 [{"id":1738055860718,"text":"যেকোনো user create এর সময় অব্শ্যই Backend থেকে autometic Dashboard-page permission টা দিয়ে দিতে হবে * ।","isComplete":false},{"id":1738055866696,"text":"অথবা database এ Dashboard-page এর id কখনও change হওয়া যাবেনা *** ।","isComplete":false}]

 * Data 2
 [{"id":1737812583471,"text":"Employee create এর সময় credit limit & basic salary 0 দিতে হবে","isComplete":false},{"id":1737812630914,"text":"শুধুমাত্র Officer and manager designatin হলে relation create icon থাকবে","isComplete":false},{"id":1737812646763,"text":"Supplier details page modify","isComplete":false},{"id":1737812659843,"text":"Supplier details table modify","isComplete":false},{"id":1737812694569,"text":"Select date change করে expire date হবে","isComplete":false},{"id":1737812743490,"text":"stock-in এ calculate price option হবে","isComplete":false},{"id":1737812781593,"text":"Product datails table এ total bill change করে grand total হবে","isComplete":false},{"id":1737812812325,"text":"Customer table থেকে balance & due delete হবে","isComplete":false},{"id":1737812853337,"text":"customer details page এ change","isComplete":false}]
 * ***/
