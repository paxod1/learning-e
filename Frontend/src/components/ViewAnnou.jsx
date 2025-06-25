import React from 'react';
import './viewAnnou.css';
import { cleanHtml } from './cleanText';

function ViewAnnou({ content, onClose }) {
    if (!content) return null;

    console.log("from view anno>>>>>>>>", content);



    async function close() {
        content = null;
        onClose()

    }

    return (
        <div className="view-annou-overlay">
            <div className="view-annou-modal">
                <button className="close-btn" onClick={close}>✖</button>

                <h2 className="view-title" dangerouslySetInnerHTML={{ __html: cleanHtml(content.title) }}></h2>

                {content.image && (
                    <img
                        className="view-image"
                        src={`https://techwingsys.com/billtws/uploads/announcements/${content.image}`}
                        alt={content.title}
                    />
                )}

                <div className="view-description" dangerouslySetInnerHTML={{ __html: cleanHtml(content.description) }}></div>

                <p className="view-date">
                    Posted on: {new Date(content.created_at).toLocaleDateString()}
                </p>
            </div>
        </div>
    );
}

export default ViewAnnou;
