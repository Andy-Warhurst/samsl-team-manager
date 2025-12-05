import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button"; // or remove & use a plain <button>

function EditableNumberButton({ value, onCommit, buttonStyle, buttonVariant = "primary" }) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(String(value ?? ""));

    useEffect(() => {
        if (!editing) {
            setDraft(String(value ?? ""));
        }
    }, [value, editing]);

    const startEditing = () => {
        setDraft(String(value ?? ""));
        setEditing(true);
    };

    const commit = () => {
        const trimmed = draft.trim();

        // You can decide how you want to handle empty input:
        if (trimmed === "") {
            onCommit("");            // or null, or 0, depending on your needs
        } else {
            // If you want to treat it as a number, parse here:
            const num = Number(trimmed);
            if (!Number.isNaN(num)) {
                onCommit(num);         // commit once, after edit finished
            } else {
                // Invalid number → just revert to previous value
                onCommit(value);
            }
        }

        setEditing(false);
    };

    const cancel = () => {
        setEditing(false);
        setDraft(String(value ?? ""));
    };


    if (!editing) {
        return (
            <Button
                variant={buttonVariant}
                style={{
                    minHeight: 24,          // ← ensure height
                    padding: "2px 6px",     // ← enough vertical padding
                    lineHeight: 1.2,
                    ...buttonStyle,
                }}
                onClick={startEditing}
            >
                {value}
            </Button>
        );
    }

    return (
        <input
            autoFocus
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    commit();
                } else if (e.key === "Escape") {
                    e.preventDefault();
                    cancel();
                }
            }}
            style={{
                height: 24,              // ← fixed height
                padding: "2px 4px",
                boxSizing: "border-box",
                textAlign: "centre",
                fontSize: "0.8rem",
            }}
        />
    );
}
//
//
// function EditableNumberButton({ value, onCommit, buttonStyle, buttonVariant = "primary" }) {
//     const [editing, setEditing] = useState(false);
//     const [draft, setDraft] = useState(String(value ?? ""));
//
//     // Keep local draft in sync with outside value when not editing
//     useEffect(() => {
//         if (!editing) {
//             setDraft(String(value ?? ""));
//         }
//     }, [value, editing]);
//
//     const startEditing = () => {
//         setDraft(String(value ?? ""));
//         setEditing(true);
//     };
//
//     const commit = () => {
//         const trimmed = draft.trim();
//
//         // You can decide how you want to handle empty input:
//         if (trimmed === "") {
//             onCommit("");            // or null, or 0, depending on your needs
//         } else {
//             // If you want to treat it as a number, parse here:
//             const num = Number(trimmed);
//             if (!Number.isNaN(num)) {
//                 onCommit(num);         // commit once, after edit finished
//             } else {
//                 // Invalid number → just revert to previous value
//                 onCommit(value);
//             }
//         }
//
//         setEditing(false);
//     };
//
//     const cancel = () => {
//         setEditing(false);
//         setDraft(String(value ?? ""));
//     };
//
//     if (!editing) {
//         // Normal state: show button with the number
//         return (
//             <Button
//                 variant={buttonVariant}
//                 style={buttonStyle}
//                 onClick={startEditing}
//             >
//                 {value}
//             </Button>
//         );
//     }
//
//     // Editing state: show an input instead of the button
//     return (
//         <input
//             autoFocus
//             type="text"
//             value={draft}
//             onChange={(e) => setDraft(e.target.value)}    // local only, no external processing yet
//             onBlur={commit}                               // commit when leaving the field
//             onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                     e.preventDefault();
//                     commit();                                 // commit once on Enter
//                 } else if (e.key === "Escape") {
//                     e.preventDefault();
//                     cancel();                                 // revert on Escape
//                 }
//             }}
//             style={{
//                 width: "60px",
//                 textAlign: "centre",
//                 fontSize: "0.8rem"
//             }}
//         />
//     );
// }
//
 export default EditableNumberButton;
