# Chat App với GPT-OSS-120B

Ứng dụng chat đơn giản được xây dựng với React và Vite, tích hợp model GPT-OSS-120B thông qua API Groq.

## Tính năng

- 🎯 Giao diện chat đơn giản và thân thiện
- 🤖 Tích hợp model GPT-OSS-120B từ Groq
- ⚡ Xây dựng với Vite để phát triển nhanh
- 📱 Responsive design cho mobile và desktop
- 🎨 Giao diện hiện đại với CSS tùy chỉnh

## Cài đặt và chạy

1. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

2. **Cấu hình environment variables:**
   Tạo file `.env` trong thư mục root với nội dung:
   ```
   VITE_GPT_API_ENDPOINT=https://api.groq.com/openai/v1/chat/completions
   VITE_GPT_API_KEY=your_api_key_here
   VITE_GPT_MODEL=openai/gpt-oss-120b
   ```

3. **Chạy ứng dụng:**
   ```bash
   npm run dev
   ```

4. **Build cho production:**
   ```bash
   npm run build
   ```

## Deploy lên Vercel

### Bước 1: Chuẩn bị
1. **Fork hoặc push code lên GitHub repository**
2. **Cấu hình environment variables:**
   - Copy file `.env.example` thành `.env`
   - Thay thế `your_groq_api_key_here` bằng API key thực của bạn

### Bước 2: Deploy
1. **Truy cập [Vercel.com](https://vercel.com)**
2. **Import GitHub repository**
3. **Cấu hình Environment Variables trong Vercel Dashboard:**
   ```
   VITE_GPT_API_ENDPOINT = https://api.groq.com/openai/v1/chat/completions
   VITE_GPT_API_KEY = your_actual_groq_api_key
   VITE_GPT_MODEL = openai/gpt-oss-120b
   ```
4. **Deploy!**

### Bước 3: Tự động deploy
- Mọi thay đổi push lên branch `main` sẽ tự động deploy
- Preview deployments cho các pull requests

## Công nghệ sử dụng

- **React 18**: Library UI
- **Vite**: Build tool và development server
- **JavaScript (ES6+)**: Ngôn ngữ lập trình
- **CSS3**: Styling và responsive design
- **Groq API**: Giao tiếp với GPT-OSS-120B model
