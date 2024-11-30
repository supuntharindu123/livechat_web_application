import React, { useState, useEffect, useRef } from "react";
import Usercircle from "../images/user-circle.svg";
import Editbtn from "../images/edit.svg";
import Deletebtn from "../images/trash.svg";
import Sendbtn from "../images/send-2.svg";
import Donebtn from "../images/done.png";
import Xbtn from "../images/X.png";
import FileBtn from "../images/fileupload.png";
import { io } from "socket.io-client";
import Swal from "sweetalert2";
import Wall3 from "../images/wall5.jpg";

const socket = io("http://localhost:3001");

function chat() {
  const [input, setinput] = useState("");
  const [username, setUsername] = useState([]);
  const [mesgs, setmesgs] = useState([]);
  const [option, setoption] = useState(false);
  const [selected, setselected] = useState(null);
  const [editDetails, seteditDetails] = useState([]);
  const [btn, setbtn] = useState(false);
  const [file, setfile] = useState(false);
  const [filetype, setfiletype] = useState(null);
  const [editdisabled, seteditdisabled] = useState(false);

  console.log("file", file);
  console.log("filetype", filetype);

  console.log("edit", editDetails);

  const chatDash = useRef(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user:detail"));
    setUsername(user.Username);
  }, []);

  useEffect(() => {
    socket.on("receive_msg", (msg, sender, data3) => {
      setmesgs((prevMessages) => [
        ...prevMessages,
        { messages: msg, sendername: sender, createdAt: data3 },
      ]);
      scroolbtn();
    });

    socket.on("edited_msg", (data1, data2) => {
      setmesgs((prevMessages) =>
        prevMessages.map((msg) =>
          msg.mesgId === data1 ? { ...msg, messages: data2 } : msg
        )
      );
    });

    socket.on("deleted_msg", (data) => {
      setmesgs((prevMessages) =>
        prevMessages.filter((msg) => msg.mesgId !== data)
      );
    });

    return () => {
      socket.off("receive_msg");
      socket.off("deleted_msg");
      socket.off("edited_msg");
    };
  }, []);

  const sendmessage = async () => {
    const res = await fetch("http://localhost:3001/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: input,
        sendername: username,
      }),
    });
    if (res.status === 200) {
      socket.emit("send_msg", input, username, "Just Now");
      setinput("");
      getmessages();
      scroolbtn();
    }
  };

  useEffect(() => {
    getmessages();
  }, []);

  console.log("selected", selected);

  const getmessages = async () => {
    try {
      const res = await fetch("http://localhost:3001/getmsgs", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const resdata = await res.json();
      setmesgs(resdata);
      console.log(resdata);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteMessage = async (mesgId) => {
    try {
      const res = await fetch(
        `http://localhost:3001/deleteMessages/${mesgId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        getmessages();
        socket.emit("deletemsg", mesgId);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const removemessage = (msgId) => {
    Swal.fire({
      title: "Are You Remove Message?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#747976",
      cancelButtonColor: "#C2C8C4",
      confirmButtonText: "delete",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMessage(msgId);
        Swal.fire({
          title: "Deleted Message!",
          text: "Your message has been deleted.",
          icon: "success",
        });
      }
    });
  };

  const editMessage = async (mesgId) => {
    try {
      const res = await fetch(`http://localhost:3001/editMessage/${mesgId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
        }),
      });
      if (res.status === 200) {
        getmessages();
        seteditDetails([]);
        setbtn(false);
        socket.emit("editMessage", mesgId, input);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadfile = async () => {
    const formData = new FormData();
    formData.append("file", filetype);
    formData.append("sendername", username);
    console.log("formdata", formData);
    try {
      const res = await fetch(`http://localhost:3001/filesend`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log("data", data.filename);
      socket.emit("filesend", data.filename, username, "Just Now");
      getmessages();
      scroolbtn();
    } catch (error) {
      console.log(error);
    }
  };

  const Getdetails = async (msgId) => {
    try {
      const res = await fetch(`http://localhost:3001/details/${msgId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const resdata = await res.json();
      console.log("resdatamsg", resdata.message);
      // if (resdata.fileType === "file") {
      //   seteditdisabled(true);
      // } else {
      //   seteditdisabled(false);
      // }
      return resdata;
    } catch (error) {
      console.log(error);
    }
  };

  const openfile = async (msgId) => {
    const resdata = await Getdetails(msgId);
    // if (resdata.fileType === "file")
    if (editdisabled === "file") {
      window.open(`http://localhost:3001/${resdata.message}`);
    }
  };

  console.log("resdata", openfile(selected));

  const scroolbtn = () => {
    chatDash.current.scrollTo({
      top: chatDash.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth();
    const day = date.getDate();
    return `${month}/${day}`;
  };

  const formatTime = (timeString) => {
    const time = new Date(timeString);
    const hour = time.getHours();
    const minutes = time.getMinutes();
    return `${hour}:${minutes}`;
  };

  return (
    <div
      className="flex items-center justify-center w-full bg-slate-50"
      style={{
        backgroundImage: `url(${Wall3})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="m-10 w-[35%] bg-neutral-400 h-[630px] rounded-lg shadow-lg shadow-slate-600 border-2 border-gray-500">
        <div className="w-full h-[40px] p-1 text-3xl font-bold text-center rounded-t-lg bg-neutral-400  underline">
          Live Chat
        </div>
        <div
          className=" bg-slate-100 h-[520px] overflow-y-scroll mb-2 rounded-lg my-2 mx-2 shadow-md shadow-slate-800 border-gray-500 border-2"
          id="chatDash"
          ref={chatDash}
        >
          <div className=" h-fit">
            <div className="flex flex-row items-center justify-center mt-3 -mb-4 border-x-0 border-neutral-900 "></div>
            {mesgs.map((msg) => {
              const isSelected = msg.mesgId === selected && option;
              console.log("msg", msg);
              if (msg.sendername === username) {
                return (
                  <div>
                    <div className="flex flex-col mt-1 mb-2">
                      <div className="flex flex-row ml-auto">
                        <div className="ml-1 mr-1 font-sans text-[8px] text-neutral-500 mt-1">
                          {formatTime(msg.createdAt) +
                            "   " +
                            formatDate(msg.createdAt)}
                        </div>
                        <div className="ml-0 font-sans text-xs text-neutral-600">
                          {msg.sendername + " (You)"}
                        </div>

                        <img
                          src={Usercircle}
                          className="rounded-full shadow-sm shadow-neutral-500"
                          width={16}
                          height={15}
                        ></img>
                      </div>
                      <div className="flex flex-row ml-auto">
                        {isSelected && (
                          <div className="w-6 h-10 mt-2 ml-auto mr-2 -mb-12 bg-slate-200">
                            {editdisabled !== "file" && (
                              <img
                                src={Editbtn}
                                width={15}
                                height={15}
                                className="ml-1 mr-1 "
                                onClick={() => {
                                  setinput(editDetails.msg);
                                  setbtn(true);
                                  console.log("editDetails", editDetails.msg);
                                }}
                              ></img>
                            )}

                            <img
                              src={Deletebtn}
                              width={15}
                              height={15}
                              className="mt-1 ml-1 mr-1"
                              onClick={() => removemessage(selected)}
                            ></img>
                          </div>
                        )}

                        <div
                          onClick={() => {
                            if (msg.mesgId === selected) {
                              setoption(false);
                            } else {
                              setselected(msg.mesgId);
                              seteditdisabled(msg.fileType);
                              seteditDetails({
                                id: msg.mesgId,
                                msg: msg.messages,
                              });
                              setoption(true);
                              editdisabled !== "file" && openfile(selected);
                            }
                          }}
                          className={`max-h-full min-w-0 min-h-0 p-1 mb-1 ml-auto mr-2 text-base shadow cursor-pointer from-neutral-950 shadow-neutral-400 w-fit max-w-64 rounded-b-xl rounded-tl-xl h-fit text-neutral-800 ${
                            selected === msg.mesgId
                              ? "bg-gray-100"
                              : "bg-gray-300"
                          }`}
                        >
                          {msg.messages}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div>
                    <div className="flex flex-col mt-1 mb-2">
                      <div className="flex flex-row">
                        <img
                          src={Usercircle}
                          className="rounded-full shadow-sm shadow-neutral-500"
                          width={16}
                          height={15}
                        ></img>

                        <div className="ml-0 font-sans text-xs text-neutral-600">
                          {msg.sendername}
                        </div>
                        <div className="ml-1 mr-1 font-sans text-[8px] text-neutral-500 mt-1">
                          {formatTime(msg.createdAt) +
                            "   " +
                            formatDate(msg.createdAt)}
                        </div>
                      </div>
                      <div
                        onClick={() => {}}
                        className="max-h-full min-w-0 min-h-0 p-1 mb-1 ml-2 mr-2 font-sans text-base shadow cursor-pointer from-neutral-900 bg-slate-200 shadow-neutral-400 w-fit max-w-64 rounded-b-xl rounded-tr-xl h-fit text-neutral-800"
                      >
                        {msg.messages}
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
        <div className=" mx-2 bg-slate-200 rounded-md  shadow-md shadow-slate-600 h-[45px] flex justify-center items-center flex-row">
          <img
            src={FileBtn}
            width={30}
            height={25}
            className="ml-2 opacity-100"
          ></img>
          <input
            type="file"
            className="w-8 h-10 mt-3 mr-2 -ml-6 opacity-0 cursor-pointer"
            onChange={(e) => setfiletype(e.target.files[0])}
            onClick={() => setfile(true)}
          ></input>
          <input
            type="text"
            id="inputs"
            name="inputs"
            placeholder="Enter Message..."
            className="w-[550px] m-1 min-h-[10px] max-h-[120px]  h-fit shadow-md shadow-slate-700 border-separate rounded text-xl pl-4 font-mono text-slate-800"
            value={input}
            onChange={(e) => setinput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendmessage();
            }}
            onClick={() => {
              setoption(false), setselected(null);
            }}
          ></input>
          {btn ? (
            <>
              <img
                src={Donebtn}
                width={25}
                height={25}
                onClick={() => {
                  editMessage(editDetails.id), setinput("");
                }}
              ></img>
              <img
                src={Xbtn}
                width={25}
                height={25}
                onClick={() => {
                  seteditDetails([]),
                    setbtn(false),
                    setinput(""),
                    setoption(false);
                }}
              ></img>
            </>
          ) : (
            <img
              src={Sendbtn}
              width={25}
              height={25}
              onClick={() => {
                file ? uploadfile() : sendmessage();
              }}
            ></img>
          )}
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default chat;
