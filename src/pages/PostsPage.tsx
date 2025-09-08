import React, { useState, useRef } from "react";
import { Send, ArrowLeft, MessageSquare, Users, Clock } from "lucide-react";

type Post = {
  id: number;
  content: string;
  comments: string[];
  createdAt: string;
};

type Category = {
  id: string;
  name: string;
  laoName: string;
  color: string;
  description: string;
  postCount: number;
};

const categories: Category[] = [
  { 
    id: "work", 
    name: "Work", 
    laoName: "ວຽກງານ", 
    color: "bg-[#B5C0D0]", 
    description: "ສົນທະນາກ່ຽວກັບວຽກການ ແລະ ອາຊີບ",
    postCount: 24 
  },
  { 
    id: "love", 
    name: "Love", 
    laoName: "ຄວາມຮັກ", 
    color: "bg-[#DAABB5]", 
    description: "ແບ່ງປັນເລື່ອງຄວາມຮັກ ແລະ ຄວາມໂລແມນຕິກ",
    postCount: 45 
  },
  { 
    id: "family", 
    name: "Family", 
    laoName: "ຄອບຄົວ", 
    color: "bg-[#7896AB]", 
    description: "ເລື່ອງຄອບຄົວ ແລະ ຄວາມສຳພັນໃນຄອບຄົວ",
    postCount: 32 
  },
  { 
    id: "diary", 
    name: "Diary", 
    laoName: "ຊີວິດປະຈຳວັນ", 
    color: "bg-[#FCDD9D]", 
    description: "ບັນທຶກຊີວິດປະຈຳວັນ ແລະ ປະສົບການ",
    postCount: 78 
  },
  { 
    id: "study", 
    name: "Study", 
    laoName: "ການຮຽນ", 
    color: "bg-[#D9B99F]", 
    description: "ການຮຽນຮູ້ ແລະ ການພັດທະນາຕົນເອງ",
    postCount: 56 
  },
  { 
    id: "relationship", 
    name: "Relationship", 
    laoName: "ຄວາມສຳພັນ", 
    color: "bg-[#BAD6EB]", 
    description: "ຄວາມສຳພັນກັບໝູ່ເພື່ອນ ແລະ ສັງຄົມ",
    postCount: 39 
  },
];

export default function ForumApp() {
  const [currentView, setCurrentView] = useState<"categories" | "category">("categories");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [commentTexts, setCommentTexts] = useState<{ [key: number]: string }>({});
  const textareaRefs = useRef<{ [key: number]: HTMLTextAreaElement | null }>({});

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setCurrentView("category");
    // In a real app, you'd fetch posts for this category here
    setPosts([]);
  };

  const handleBackToCategories = () => {
    setCurrentView("categories");
    setSelectedCategory(null);
    setPosts([]);
    setNewPost("");
    setCommentTexts({});
  };

  const handleAddPost = () => {
    if (!newPost.trim()) return;
    const post: Post = {
      id: Date.now(),
      content: newPost,
      comments: [],
      createdAt: new Date().toISOString(),
    };
    setPosts([post, ...posts]);
    setNewPost("");
  };

  const handleAddComment = (postId: number) => {
    const commentText = commentTexts[postId]?.trim();
    if (!commentText) return;

    setPosts(posts =>
      posts.map(p =>
        p.id === postId ? { ...p, comments: [...p.comments, commentText] } : p
      )
    );
    
    setCommentTexts(prev => ({ ...prev, [postId]: "" }));
    const textarea = textareaRefs.current[postId];
    if (textarea) {
      textarea.style.height = "auto";
    }
  };

  const handleCommentChange = (postId: number, value: string) => {
    setCommentTexts(prev => ({ ...prev, [postId]: value }));
  };

  const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  const handleKeyPress = (e: React.KeyboardEvent, postId: number) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment(postId);
    }
  };

  if (currentView === "categories") {
    return (
      <div className="min-h-screen bg-white from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto p-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">ພື້ນທີ່ສົນທະນາ</h1>
            <p className="text-lg text-gray-600">ເລືອກໝວດທີ່ທ່ານສົນໃຈ ແລະ ເລີ່ມສົນທະນາ</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#FFFAF1] rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-800">1,247</p>
                  <p className="text-gray-600">ສະມາຊິກທັງໝົດ</p>
                </div>
              </div>
            </div>
            <div className="bg-[#FFFAF1] rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-800">274</p>
                  <p className="text-gray-600">ໂພສຕ໌ທັງໝົດ</p>
                </div>
              </div>
            </div>
            <div className="bg-[#FFFAF1] rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-800">12</p>
                  <p className="text-gray-600">ກິດຈະກຳມື້ນີ້</p>
                </div>
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className={`cursor-pointer rounded-2xl p-8 text-white shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 ${category.color}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">{category.laoName}</h2>
                  <MessageSquare className="h-6 w-6 opacity-80" />
                </div>
                <p className="text-white/90 mb-4 text-sm leading-relaxed">
                  {category.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
                    {category.name}
                  </span>
                  <span className="text-sm font-medium">
                    {category.postCount} ໂພສຕ໌
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={handleBackToCategories}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>ກັບໄປໝວດຕ່າງໆ</span>
            </button>
          </div>
          <div className={`inline-block px-4 py-2 rounded-lg text-white text-sm font-medium ${selectedCategory?.color}`}>
            {selectedCategory?.name}
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mt-2">
            ໝວດ: {selectedCategory?.laoName}
          </h1>
          <p className="text-gray-600 mt-2">{selectedCategory?.description}</p>
        </div>

        {/* Add new post */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-800">ສ້າງໂພສຕ໌ໃໝ່</h2>
          </div>
          <div className="p-6">
            <div className="flex gap-3">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="ຂຽນເນື້ອໃນໃໝ່..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none resize-none min-h-[80px]"
                onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleAddPost())}
              />
              <button
                onClick={handleAddPost}
                disabled={!newPost.trim()}
                className="bg-primary hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors self-start"
              >
                ສົ່ງ
              </button>
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm text-center py-16">
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-600 mb-2">ຍັງບໍ່ມີໂພສຕ໌ໃດໆ</p>
              <p className="text-gray-500">ເຮັດໃຫ້ເປັນຄົນທຳອິດທີ່ໂພສຕ໌ໃນໝວດນີ້!</p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      👤
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 text-lg leading-relaxed">
                        {post.content}
                      </p>
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        ໂພສຕ໌ເມື່ອ {new Date(post.createdAt).toLocaleString('lo-LA')}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 mb-4">
                      <MessageSquare className="h-4 w-4 text-gray-500" />
                      <h3 className="font-semibold text-gray-700">
                        ຄວາມຄິດເຫັນ
                      </h3>
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        {post.comments.length}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                      {post.comments.length === 0 ? (
                        <p className="text-sm text-gray-400 italic text-center py-4">
                          ຍັງບໍ່ມີຄວາມຄິດເຫັນ - ເປັນຄົນທຳອິດທີ່ຄອມເມັ້ນ!
                        </p>
                      ) : (
                        post.comments.map((comment, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                              👤
                            </div>
                            <div className="flex-1 bg-gray-50 rounded-lg px-4 py-3 border-l-3 border-blue-200">
                              <p className="text-sm text-gray-700 break-words">
                                {comment}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Comment input */}
                    <div className="flex items-end gap-3 pt-2 border-t">
                      <div className="flex-1">
                        <textarea
                          ref={(el) => { textareaRefs.current[post.id] = el; }}
                          value={commentTexts[post.id] || ""}
                          onChange={(e) => handleCommentChange(post.id, e.target.value)}
                          onInput={handleTextareaInput}
                          onKeyPress={(e) => handleKeyPress(e, post.id)}
                          placeholder="ສະແດງຄວາມຄິດເຫັນ... (Enter ເພື່ອສົ່ງ, Shift+Enter ເພື່ອຂຶ້ນບັນທັດໃໝ່)"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none resize-none transition-all min-h-[40px]"
                          rows={1}
                        />
                      </div>
                      <button
                        onClick={() => handleAddComment(post.id)}
                        disabled={!commentTexts[post.id]?.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white p-2.5 rounded-lg flex items-center justify-center transition-colors"
                        title="ສົ່ງຄວາມຄິດເຫັນ"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}