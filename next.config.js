/** @type {import('next').NextConfig} */
const nextConfig = {
  // 로컬 개발용 프록시 설정
  async rewrites() {
    return [
      {
        source: '/api/analyze',
        destination: 'http://localhost:8000/analyze',
      },
    ];
  },
};

module.exports = nextConfig;
