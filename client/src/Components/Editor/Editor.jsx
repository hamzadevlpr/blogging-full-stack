import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import Article from '../Blogs/Article';


export default function App() {
    const editorRef = useRef(null);
    const [editorContent, setEditorContent] = useState('');

    const log = () => {
        if (editorRef.current) {
            const content = editorRef.current.getContent();
            console.log(content);
            setEditorContent(content);
        }
    };

    const handleContentChange = (newContent) => {
        // Handle content change in the App component
        setEditorContent(newContent);
    };
    return (
        <>
            <div>

                <Editor
                    apiKey='riszckn153vr0fold8pqt389fc3fg05caav5pxxzzrc930sg'
                    onInit={(evt, editor) => editorRef.current = editor}
                    // initialValue="<p>This is the initial content of the editor.</p>"
                    init={{
                        height: 500,
                        menubar: false,
                        file_picker_types: 'file image media',
                        plugins: [
                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                        ],
                        toolbar: 'undo redo | blocks | ' +
                            'bold italic forecolor | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent | ' +
                            'removeformat | help',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }}
                />
            </div>
        </>
    );
}