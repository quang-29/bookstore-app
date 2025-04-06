// This is a mock service. Replace with actual API calls when backend is ready
export const getBooks = async (categoryId = null) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock data
  const mockBooks = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 12.99, categoryId: 1 },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', price: 14.99, categoryId: 1 },
    { id: 3, title: 'Sapiens', author: 'Yuval Noah Harari', price: 19.99, categoryId: 2 },
    { id: 4, title: 'A Brief History of Time', author: 'Stephen Hawking', price: 15.99, categoryId: 3 },
    { id: 5, title: 'The Wright Brothers', author: 'David McCullough', price: 16.99, categoryId: 4 },
    { id: 6, title: 'Steve Jobs', author: 'Walter Isaacson', price: 18.99, categoryId: 5 },
    { id: 7, title: 'Clean Code', author: 'Robert C. Martin', price: 29.99, categoryId: 6 },
  ];

  if (categoryId) {
    return mockBooks.filter(book => book.categoryId === categoryId);
  }

  return mockBooks;
}; 