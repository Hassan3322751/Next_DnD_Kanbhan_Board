import "./TaskCard.css";

const TaskCard = ({ id, stageId, index, title, description, dueDate, 
    handleTaskDelete, 
    handleTaskEdit, 
    setActiveCard 
}) => {
// console.log(stageId)
    return (
        <article className='task_card' id={id} draggable 
            onDragStart={() => setActiveCard({stageId: stageId, stageIndex: index, cardId: id})} 
            onDragEnd={() => setActiveCard({stageId: null, stageIndex: null, cardId: null})}
        >
                <p className="d-block">{id}</p>
            <div className="card_header">
                <p className='task_text'>{title}</p>

                <button className="task_delete" onClick={() => handleTaskDelete(id)}>
                    {/* <img src={deleteIcon} className='delete_icon' alt='delete' title="Delete" /> */}
                </button>
                <button className="task_delete" onClick={() => handleTaskEdit(id)}>
                    {/* <img src={editIcon} className='delete_icon' alt='edit' title="Edit" /> */}
                </button>
            </div>
            <p>{description} <sup>Description</sup></p>
            <span className="text-red-500">Due: {dueDate}</span>
        </article>
    );
};

export default TaskCard;
