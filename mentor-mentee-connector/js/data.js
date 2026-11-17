/**
 * DỮ LIỆU MẪU HỆ THỐNG - CỔNG KẾT NỐI CỐ VẤN & HỌC NHÓM (MENTOR-MENTEE CONNECTOR)
 * Phân hệ 5 - Học phần Thiết kế Web
 * Lưu ý: Dùng biến toàn cục để tương thích khi mở trực tiếp bằng giao thức file://
 */

// Thông tin người học mặc định (không yêu cầu đăng nhập ở phiên bản demo này)
const MENTEE = {
  id: "me",
  name: "Nguyễn Minh Anh",
  avatar: "images/avatars/me.jpg",
  email: "minhanh.nguyen@student.edu.vn",
  faculty: "Công nghệ Thông tin",
  university: "Đại học Bách Khoa TP.HCM"
};

// Danh mục kỹ năng mục tiêu
const SKILLS = [
  "Lập trình Web",
  "Python",
  "Phân tích dữ liệu",
  "Machine Learning",
  "UI/UX Design",
  "IELTS",
  "Kỹ năng thuyết trình",
  "Quản lý dự án",
  "Marketing số",
  "Kỹ năng phỏng vấn",
  "Cloud & DevOps",
  "Kỹ năng viết luận"
];

// Danh sách ít nhất 10 cố vấn với thông tin chi tiết và đánh giá 360 độ
const MENTORS = [
  {
    id: "m1",
    name: "chị bảy",
    avatar: "images/avatars/m1.jpg",
    title: "Senior Frontend Engineer @ FPT Software",
    bio: "Hơn 7 năm kinh nghiệm xây dựng các ứng dụng Web quy mô lớn với JavaScript hiện đại, React và tối ưu hiệu năng. Đã hỗ trợ hơn 50 bạn sinh viên hoàn thiện portfolio và vượt qua các vòng phỏng vấn kỹ thuật tuyển dụng. Phương châm của mình là học thông qua giải quyết bài toán thực tế và viết code sạch chuẩn công nghiệp.",
    skills: ["Lập trình Web", "UI/UX Design", "Kỹ năng phỏng vấn"],
    experienceYears: 7,
    sessionsTaught: 142,
    languages: ["Tiếng Việt", "English (Professional)"],
    rating: 4.9,
    reviewCount: 46,
    ratingBreakdown: {
      expertise: 5.0,
      communication: 4.8,
      punctuality: 4.9,
      helpfulness: 5.0
    },
    reviews: [
      {
        author: "Vũ Hải Đăng",
        role: "Người học",
        rating: 5,
        comment: "Anh Nam hướng dẫn rất tận tình, review chi tiết từng dòng code và chỉ ra các lỗi kiến trúc mà ở trường chưa được dạy. Nhờ anh mà em tự tin pass vị trí Fresher!",
        date: "2026-11-05"
      },
      {
        author: "Phan Thanh Tùng",
        role: "Đồng nghiệp",
        rating: 5,
        comment: "Làm việc cùng Nam ở nhiều dự án lớn, Nam luôn có tư duy kiến trúc tốt và khả năng truyền đạt kiến thức kỹ thuật rất gãy gọn, dễ hiểu.",
        date: "2026-10-22"
      },
      {
        author: "Lê Hoàng Yến",
        role: "Người học",
        rating: 5,
        comment: "Buổi mock interview với anh Nam cực kỳ sát với thực tế phỏng vấn ở các công ty công nghệ lớn. Rất đáng giá!",
        date: "2026-10-10"
      },
      {
        author: "TS. Nguyễn Văn Hùng",
        role: "Mentor khác",
        rating: 4.8,
        comment: "Nam là một mentor rất có trách nhiệm và tâm huyết với cộng đồng sinh viên công nghệ.",
        date: "2026-09-18"
      }
    ],
    availability: {
      1: ["19:00", "20:00"],
      2: ["19:00", "20:00"],
      3: ["08:00", "09:00", "19:00"],
      5: ["19:00", "20:00"],
      6: ["09:00", "10:00", "14:00"]
    }
  },
  {
    id: "m2",
    name: "Si lùn",
    avatar: "images/avatars/m2.jpg",
    title: "Lead Data Scientist @ Viettel AI Lab",
    bio: "Chuyên gia nghiên cứu và ứng dụng Khoa học dữ liệu, Machine Learning với hơn 6 năm thực chiến. Từng đạt học bổng thạc sĩ toàn phần tại Đại học Quốc gia Singapore (NUS). Đam mê đồng hành cùng các bạn trẻ khám phá vẻ đẹp của dữ liệu và xây dựng lộ trình học tập bài bản từ toán ứng dụng đến mô hình thực tế.",
    skills: ["Python", "Phân tích dữ liệu", "Machine Learning"],
    experienceYears: 6,
    sessionsTaught: 98,
    languages: ["Tiếng Việt", "English (Fluent)"],
    rating: 4.9,
    reviewCount: 38,
    ratingBreakdown: {
      expertise: 5.0,
      communication: 4.9,
      punctuality: 4.8,
      helpfulness: 4.9
    },
    reviews: [
      {
        author: "Đinh Quỳnh Nga",
        role: "Người học",
        rating: 5,
        comment: "Chị Trang giải thích các thuật toán Machine Learning rất trực quan, không dùng toán đánh đố mà dùng ví dụ cuộc sống nên tiếp thu cực nhanh.",
        date: "2026-11-08"
      },
      {
        author: "Hoàng Minh Trí",
        role: "Đồng nghiệp",
        rating: 5,
        comment: "Trang có nền tảng toán và xác suất thống kê rất vững. Một trong những chuyên gia Data Science xuất sắc nhất lab.",
        date: "2026-10-15"
      },
      {
        author: "Trương Quốc Bảo",
        role: "Người học",
        rating: 5,
        comment: "Nhờ chị Trang định hướng đề tài nghiên cứu mà nhóm em đã giành giải cao trong cuộc thi sinh viên NCKH cấp trường.",
        date: "2026-09-28"
      }
    ],
    availability: {
      1: ["08:00", "09:00"],
      3: ["19:00", "20:00"],
      4: ["19:00", "20:00"],
      6: ["08:00", "09:00", "10:00"],
      0: ["14:00", "15:00"]
    }
  },
  {
    id: "m3",
    name: "Độc Tày",
    avatar: "images/avatars/m3.jpg",
    title: "Senior Product Designer @ MoMo FinTech",
    bio: "Nhà thiết kế sản phẩm số với hơn 8 năm kiến tạo trải nghiệm người dùng cho hàng triệu khách hàng ứng dụng tài chính. Luôn hướng tới sự tinh tế, dễ tiếp cận và thiết kế vị nhân sinh (User-Centered Design). Rất hào hứng giúp các bạn sinh viên xây dựng tư duy Design Thinking và hoàn thiện UI/UX Case Study chuẩn quốc tế.",
    skills: ["UI/UX Design", "Kỹ năng thuyết trình", "Kỹ năng phỏng vấn"],
    experienceYears: 8,
    sessionsTaught: 175,
    languages: ["Tiếng Việt", "English"],
    rating: 4.8,
    reviewCount: 52,
    ratingBreakdown: {
      expertise: 4.9,
      communication: 5.0,
      punctuality: 4.7,
      helpfulness: 4.8
    },
    reviews: [
      {
        author: "Ngô Nhật Linh",
        role: "Người học",
        rating: 5,
        comment: "Anh Khoa chữa bài portfolio thiết kế cực kỳ tỉ mỉ. Từng khoảng trắng, tỉ lệ typography và luồng người dùng đều được mổ xẻ chuẩn chỉnh.",
        date: "2026-11-02"
      },
      {
        author: "Vũ Đức Thắng",
        role: "Người học",
        rating: 5,
        comment: "Buổi tư vấn giúp mình hiểu rõ sự khác biệt giữa vẽ giao diện đẹp và giải quyết vấn đề kinh doanh bằng trải nghiệm người dùng.",
        date: "2026-10-19"
      },
      {
        author: "Mai Phương Thảo",
        role: "Mentor khác",
        rating: 4.7,
        comment: "Khoa có góc nhìn sản phẩm rất rộng và tinh thần chia sẻ cởi mở, đóng góp tích cực cho cộng đồng thiết kế trẻ.",
        date: "2026-09-04"
      }
    ],
    availability: {
      2: ["18:00", "19:00", "20:00"],
      4: ["18:00", "19:00", "20:00"],
      5: ["19:00", "20:00"],
      6: ["14:00", "15:00", "16:00"]
    }
  },
  {
    id: "m4",
    name: "Độ Mixue",
    avatar: "images/avatars/m4.jpg",
    title: "Academic Director & IELTS 8.5 Master Coach",
    bio: "Giảng viên chuyên ngữ với hơn 9 năm luyện thi chứng chỉ quốc tế IELTS và kỹ năng viết học thuật cho ứng viên học bổng chính phủ. Từng giúp hơn 200 học viên nâng band điểm từ 6.0 lên 7.5+ trong thời gian tối ưu. Định hướng đào tạo bài bản về tư duy phản biện, cấu trúc lập luận và phản xạ giao tiếp tự nhiên.",
    skills: ["IELTS", "Kỹ năng viết luận", "Kỹ năng thuyết trình"],
    experienceYears: 9,
    sessionsTaught: 230,
    languages: ["Tiếng Việt", "English (Native proficiency)"],
    rating: 5.0,
    reviewCount: 74,
    ratingBreakdown: {
      expertise: 5.0,
      communication: 5.0,
      punctuality: 5.0,
      helpfulness: 5.0
    },
    reviews: [
      {
        author: "Phạm Gia Khánh",
        role: "Người học",
        rating: 5,
        comment: "Cô Dương sửa bài Writing Task 2 siêu chi tiết, chỉ ra từng lỗi collocations và tư duy cohesion làm bài viết mượt mà hẳn lên.",
        date: "2026-11-10"
      },
      {
        author: "Nguyễn Thu Hà",
        role: "Người học",
        rating: 5,
        comment: "Phương pháp luyện Speaking 1-1 với cô giúp em hết sợ nói tiếng Anh trước hội đồng. Đạt 8.0 Speaking ngoài mong đợi!",
        date: "2026-10-25"
      },
      {
        author: "ThS. Hoàng Tuấn Kiệt",
        role: "Đồng nghiệp",
        rating: 5,
        comment: "Thùy Dương có chuyên môn sư phạm xuất sắc và khả năng truyền cảm hứng học tập mạnh mẽ cho bất kỳ học viên nào.",
        date: "2026-09-15"
      }
    ],
    availability: {
      1: ["08:00", "09:00", "10:00"],
      3: ["08:00", "09:00", "10:00"],
      5: ["14:00", "15:00", "16:00"],
      6: ["08:00", "09:00"],
      0: ["09:00", "10:00"]
    }
  },
  {
    id: "m5",
    name: "Thủ Khoa Khối A ",
    avatar: "images/avatars/m5.jpg",
    title: "Engineering Manager & Cloud Architect @ VNG Corporation",
    bio: "Hơn 11 năm kinh nghiệm trong ngành phần mềm, chịu trách nhiệm kiến trúc đám mây và hệ thống phân tán phục vụ hàng chục triệu người dùng. Có kinh nghiệm sâu sắc về Agile/Scrum, quản trị dự án công nghệ và phát triển năng lực đội ngũ kỹ sư trẻ. Luôn sẵn sàng chia sẻ cách quản lý dự án hiệu quả và định hướng sự nghiệp IT đường dài.",
    skills: ["Quản lý dự án", "Cloud & DevOps", "Lập trình Web"],
    experienceYears: 11,
    sessionsTaught: 160,
    languages: ["Tiếng Việt", "English"],
    rating: 4.8,
    reviewCount: 42,
    ratingBreakdown: {
      expertise: 5.0,
      communication: 4.7,
      punctuality: 4.8,
      helpfulness: 4.8
    },
    reviews: [
      {
        author: "Trần Bảo An",
        role: "Người học",
        rating: 5,
        comment: "Anh Huy phân tích tư duy quản trị dự án cực kỳ sắc bén. Mình học được cách lên kế hoạch sprint và quản lý rủi ro cho đồ án môn học rất chuẩn.",
        date: "2026-11-04"
      },
      {
        author: "Lê Văn Khoa",
        role: "Đồng nghiệp",
        rating: 4.8,
        comment: "Một người quản lý kiêm kỹ sư xuất chúng, luôn điềm tĩnh giải quyết các bài toán hạ tầng phức tạp.",
        date: "2026-10-02"
      },
      {
        author: "Đoàn Nhật Minh",
        role: "Người học",
        rating: 4.7,
        comment: "Rất cảm ơn anh Huy đã định hướng cho em bước chuyển đổi từ Developer sang vai trò Tech Lead / Project Manager.",
        date: "2026-08-30"
      }
    ],
    availability: {
      2: ["20:00", "21:00"],
      4: ["20:00", "21:00"],
      6: ["08:00", "09:00", "10:00"],
      0: ["15:00", "16:00"]
    }
  },
  {
    id: "m6",
    name: "Trường Giang",
    avatar: "images/avatars/m6.jpg",
    title: "Digital Growth & MarTech Consultant @ Ogilvy Vietnam",
    bio: "Chuyên gia tiếp thị kỹ thuật số và tối ưu hóa chuyển đổi với hơn 5 năm tư vấn chiến dịch cho các tập đoàn FMCG và công nghệ đa quốc gia. Thế mạnh về Data-Driven Marketing, Performance Ads và chiến lược thương hiệu cá nhân. Hướng dẫn sinh viên xây dựng tư duy tiếp thị số bài bản, không chỉ dừng lại ở các mẹo vặt ngắn hạn.",
    skills: ["Marketing số", "Phân tích dữ liệu", "Kỹ năng thuyết trình"],
    experienceYears: 5,
    sessionsTaught: 85,
    languages: ["Tiếng Việt", "English"],
    rating: 4.7,
    reviewCount: 31,
    ratingBreakdown: {
      expertise: 4.8,
      communication: 4.9,
      punctuality: 4.6,
      helpfulness: 4.7
    },
    reviews: [
      {
        author: "Bùi Kiều My",
        role: "Người học",
        rating: 5,
        comment: "Chị Phương hướng dẫn cách đọc chỉ số Google Analytics và lập kế hoạch Marketing thực chiến cực kỳ dễ áp dụng vào dự án khởi nghiệp sinh viên.",
        date: "2026-10-29"
      },
      {
        author: "Trần Tuấn Anh",
        role: "Người học",
        rating: 4.5,
        comment: "Chị nhiệt tình, luôn đưa ra các câu hỏi kích thích tư duy sáng tạo và cách đo lường ROI cụ thể.",
        date: "2026-09-20"
      },
      {
        author: "Hoàng Ngọc Ánh",
        role: "Đồng nghiệp",
        rating: 4.8,
        comment: "Phương luôn cập nhật nhanh nhất các xu hướng công nghệ tiếp thị mới và chia sẻ hào phóng.",
        date: "2026-08-14"
      }
    ],
    availability: {
      1: ["18:00", "19:00"],
      2: ["18:00", "19:00"],
      4: ["18:00", "19:00"],
      5: ["19:00", "20:00"],
      6: ["14:00", "15:00"]
    }
  },
  {
    id: "m7",
    name: "Giáo Viên Âm Nhạc",
    avatar: "images/avatars/m7.jpg",
    title: "HR Director & Career Coach @ Talentnet Group",
    bio: "Chuyên gia quản trị nhân sự và khai vấn nghề nghiệp với hơn 10 năm kinh nghiệm phỏng vấn tuyển dụng hàng nghìn ứng viên cho các tập đoàn lớn. Chuyên gia tư vấn tái cấu trúc CV, rèn luyện kỹ năng phỏng vấn theo phương pháp STAR và xây dựng phong thái tự tin trước nhà tuyển dụng.",
    skills: ["Kỹ năng phỏng vấn", "Kỹ năng thuyết trình", "Kỹ năng viết luận"],
    experienceYears: 10,
    sessionsTaught: 210,
    languages: ["Tiếng Việt", "English"],
    rating: 4.9,
    reviewCount: 65,
    ratingBreakdown: {
      expertise: 5.0,
      communication: 5.0,
      punctuality: 4.9,
      helpfulness: 4.9
    },
    reviews: [
      {
        author: "Lâm Đình Trọng",
        role: "Người học",
        rating: 5,
        comment: "Chị Ngọc chỉ ra những lỗi chí mạng trong CV mà trước giờ em không hề hay biết. Sau khi sửa lại, tỉ lệ được gọi phỏng vấn tăng vọt!",
        date: "2026-11-06"
      },
      {
        author: "Trịnh Thị Mai",
        role: "Người học",
        rating: 5,
        comment: "Những câu hỏi bẫy phỏng vấn được chị giải mã và hướng dẫn trả lời rất thuyết phục, giữ được cá tính riêng của ứng viên.",
        date: "2026-10-12"
      },
      {
        author: "Nguyễn Thế Vinh",
        role: "Mentor khác",
        rating: 4.8,
        comment: "Bích Ngọc là một người dẫn đường nghề nghiệp tận tâm và luôn thấu hiểu tâm lý các bạn trẻ mới ra trường.",
        date: "2026-09-01"
      }
    ],
    availability: {
      2: ["19:00", "20:00"],
      3: ["19:00", "20:00"],
      5: ["08:00", "09:00", "10:00"],
      6: ["09:00", "10:00", "11:00"]
    }
  },
  {
    id: "m8",
    name: " Huy Forum",
    avatar: "images/avatars/m8.jpg",
    title: "AI Research Scientist @ VinAI Research",
    bio: "Nghiên cứu sinh và kỹ sư AI chuyên sâu về thị giác máy tính (Computer Vision) và mô hình ngôn ngữ lớn (LLM). Tác giả của nhiều bài báo khoa học xuất bản tại CVPR, NeurIPS. Luôn tâm niệm rằng việc làm chủ toán và thuật toán nền tảng là chìa khóa để tiến xa trong kỷ nguyên bùng nổ trí tuệ nhân tạo.",
    skills: ["Machine Learning", "Python", "Phân tích dữ liệu"],
    experienceYears: 5,
    sessionsTaught: 72,
    languages: ["Tiếng Việt", "English"],
    rating: 4.9,
    reviewCount: 29,
    ratingBreakdown: {
      expertise: 5.0,
      communication: 4.8,
      punctuality: 4.9,
      helpfulness: 4.8
    },
    reviews: [
      {
        author: "Lương Quốc Khánh",
        role: "Người học",
        rating: 5,
        comment: "Anh Hưng giải thích cấu trúc Transformers và attention mechanism sáng rõ như ban ngày. Rất ấn tượng với trình độ học thuật của anh.",
        date: "2026-10-31"
      },
      {
        author: "Đặng Hồng Nhung",
        role: "Người học",
        rating: 5,
        comment: "Anh hướng dẫn cách đọc paper quốc tế và code reproduce lại mô hình rất hiệu quả.",
        date: "2026-09-22"
      },
      {
        author: "Lê Minh Tuấn",
        role: "Đồng nghiệp",
        rating: 4.8,
        comment: "Hưng là một nhà nghiên cứu nghiêm cẩn, tư duy sắc bén và luôn sẵn lòng giúp đỡ thế hệ đàn em.",
        date: "2026-08-19"
      }
    ],
    availability: {
      1: ["20:00", "21:00"],
      3: ["20:00", "21:00"],
      5: ["20:00", "21:00"],
      6: ["14:00", "15:00", "16:00"],
      0: ["16:00", "17:00"]
    }
  },
  {
    id: "m9",
    name: "Anh 3",
    avatar: "images/avatars/m9.jpg",
    title: "Full-Stack Web Architect @ Shopee Vietnam",
    bio: "Kỹ sư kiến trúc phần mềm với hơn 8 năm chinh chiến xây dựng các hệ thống thương mại điện tử chịu tải hàng triệu request mỗi giây. Đam mê mã nguồn mở, clean architecture và tối ưu hóa trải nghiệm tương tác người dùng. Giúp sinh viên nắm vững bức tranh toàn cảnh từ database, API đến giao diện người dùng mượt mà.",
    skills: ["Lập trình Web", "Python", "Cloud & DevOps"],
    experienceYears: 8,
    sessionsTaught: 135,
    languages: ["Tiếng Việt", "English"],
    rating: 4.8,
    reviewCount: 44,
    ratingBreakdown: {
      expertise: 4.9,
      communication: 4.7,
      punctuality: 4.8,
      helpfulness: 4.9
    },
    reviews: [
      {
        author: "Võ Minh Đức",
        role: "Người học",
        rating: 5,
        comment: "Anh Phát dạy tư duy thiết kế hệ thống và API RESTful rất thực tế, khác biệt hoàn toàn với mớ lý thuyết sách vở thông thường.",
        date: "2026-11-01"
      },
      {
        author: "Tô Như Ý",
        role: "Người học",
        rating: 4.7,
        comment: "Buổi chia sẻ về cách xử lý database caching và message queue giúp đồ án tốt nghiệp của mình đạt điểm tối đa.",
        date: "2026-10-11"
      },
      {
        author: "Nguyễn Hải Nam",
        role: "Đồng nghiệp",
        rating: 4.9,
        comment: "Phát code rất sạch, tư duy hệ thống vững và luôn là chỗ dựa kỹ thuật tin cậy của toàn đội ngũ.",
        date: "2026-09-08"
      }
    ],
    availability: {
      2: ["19:00", "20:00"],
      4: ["19:00", "20:00"],
      6: ["09:00", "10:00", "11:00"],
      0: ["09:00", "10:00"]
    }
  },
  {
    id: "m10",
    name: "Thầy daden",
    avatar: "images/avatars/m10.jpg",
    title: "Senior Product Manager @ ZaloPay",
    bio: "Quản lý sản phẩm với hơn 7 năm kinh nghiệm dẫn dắt các tính năng thanh toán số và ví điện tử. Chuyên gia về phân tích yêu cầu nghiệp vụ, nghiên cứu hành vi người dùng và phương pháp luận Agile/Scrum. Giúp sinh viên và các bạn trẻ rèn luyện tư duy phản biện, kỹ năng thuyết trình ý tưởng dự án và làm việc nhóm hiệu quả.",
    skills: ["Quản lý dự án", "Kỹ năng thuyết trình", "UI/UX Design"],
    experienceYears: 7,
    sessionsTaught: 110,
    languages: ["Tiếng Việt", "English"],
    rating: 4.7,
    reviewCount: 35,
    ratingBreakdown: {
      expertise: 4.8,
      communication: 4.9,
      punctuality: 4.7,
      helpfulness: 4.8
    },
    reviews: [
      {
        author: "Cao Tiến Dũng",
        role: "Người học",
        rating: 5,
        comment: "Anh Bảo hướng dẫn cách viết Product Requirement Document (PRD) và trình bày trước hội đồng phản biện rất lôi cuốn và tự tin.",
        date: "2026-10-26"
      },
      {
        author: "Dương Quỳnh Hoa",
        role: "Người học",
        rating: 4.6,
        comment: "Mentor góp ý rất chân thành, sát thực tế công việc và chỉ rõ những điểm mình còn bỡ ngỡ khi làm dự án.",
        date: "2026-09-17"
      },
      {
        author: "Lê Khắc Cường",
        role: "Đồng nghiệp",
        rating: 4.8,
        comment: "Bảo có kỹ năng điều phối dự án và khả năng thuyết phục các stakeholder cực kỳ ấn tượng.",
        date: "2026-08-25"
      }
    ],
    availability: {
      1: ["19:00", "20:00"],
      3: ["19:00", "20:00"],
      5: ["18:00", "19:00"],
      6: ["15:00", "16:00", "17:00"]
    }
  },
  {
    id: "m11",
    name: "John Pork  ",
    avatar: "images/avatars/m11.jpg",
    title: "Data Analytics Consultant @ PwC Vietnam",
    bio: "Cố vấn phân tích kinh doanh và dữ liệu tài chính với hơn 6 năm làm việc cùng các doanh nghiệp đa quốc gia. Chuyên môn sâu về SQL nâng cao, PowerBI, Tableau và Python trực quan hóa dữ liệu kinh doanh. Rất tâm huyết hướng dẫn sinh viên khối ngành kinh tế và CNTT kết nối tư duy kinh doanh với kỹ năng kỹ thuật dữ liệu.",
    skills: ["Phân tích dữ liệu", "Python", "Kỹ năng thuyết trình"],
    experienceYears: 6,
    sessionsTaught: 94,
    languages: ["Tiếng Việt", "English"],
    rating: 4.9,
    reviewCount: 39,
    ratingBreakdown: {
      expertise: 4.9,
      communication: 5.0,
      punctuality: 4.9,
      helpfulness: 4.9
    },
    reviews: [
      {
        author: "Phan Ái Linh",
        role: "Người học",
        rating: 5,
        comment: "Chị Chi dạy cách kể chuyện bằng số liệu (Data Storytelling) đỉnh cao. Dashboard làm theo hướng dẫn của chị được thầy cô chấm 10 điểm!",
        date: "2026-11-07"
      },
      {
        author: "Nguyễn Hải Long",
        role: "Người học",
        rating: 5,
        comment: "Nhờ chị hướng dẫn làm bài test phân tích dữ liệu mà mình đã đỗ kỳ thực tập tại công ty mơ ước.",
        date: "2026-10-18"
      },
      {
        author: "Trần Mai Trang",
        role: "Đồng nghiệp",
        rating: 4.8,
        comment: "Chi luôn làm việc với sự tận tâm cao nhất, báo cáo và giải pháp đưa ra cho khách hàng luôn chỉn chu từng chi tiết.",
        date: "2026-09-12"
      }
    ],
    availability: {
      2: ["18:00", "19:00"],
      4: ["18:00", "19:00"],
      5: ["19:00", "20:00"],
      6: ["08:00", "09:00", "10:00"],
      0: ["14:00", "15:00"]
    }
  },
  {
    id: "m12",
    name: "Trấn Thành",
    avatar: "images/avatars/m12.jpg",
    title: "DevOps Lead @ Techcom Securities",
    bio: "Kỹ sư trưởng hạ tầng tự động hóa và điện toán đám mây. Hơn 8 năm vận hành hệ thống CI/CD, Kubernetes và Cloud Native trên AWS và GCP cho hệ thống tài chính chứng khoán. Định hướng sinh viên tiếp cận chuẩn các tiêu chuẩn vận hành công nghệ hiện đại, tính sẵn sàng cao và bảo mật thông tin.",
    skills: ["Cloud & DevOps", "Lập trình Web", "Quản lý dự án"],
    experienceYears: 8,
    sessionsTaught: 105,
    languages: ["Tiếng Việt", "English"],
    rating: 4.8,
    reviewCount: 36,
    ratingBreakdown: {
      expertise: 5.0,
      communication: 4.6,
      punctuality: 4.9,
      helpfulness: 4.8
    },
    reviews: [
      {
        author: "Tăng Vĩnh Khang",
        role: "Người học",
        rating: 5,
        comment: "Anh Huy hướng dẫn thiết lập pipeline CI/CD với Docker và GitHub Actions rất dễ hiểu, giải đáp cặn kẽ mọi thắc mắc lúc thực hành.",
        date: "2026-10-28"
      },
      {
        author: "Đỗ Mai Hương",
        role: "Người học",
        rating: 4.7,
        comment: "Kiến thức thực tế sâu rộng, anh chỉ bảo từng lưu ý nhỏ khi quản lý cụm server để tránh mất mát dữ liệu.",
        date: "2026-09-29"
      },
      {
        author: "Nguyễn Thế Anh",
        role: "Mentor khác",
        rating: 4.8,
        comment: "Huy là một chuyên gia kỹ thuật có tiếng trong cộng đồng DevOps Việt Nam.",
        date: "2026-08-16"
      }
    ],
    availability: {
      1: ["19:00", "20:00"],
      3: ["19:00", "20:00"],
      4: ["20:00", "21:00"],
      6: ["14:00", "15:00", "16:00"]
    }
  }
];

// Khung giờ đã có người học khác đặt (offsetDays: số ngày tính từ hôm nay của máy người dùng)
// Đảm bảo slot "Đã kín" luôn tồn tại sinh động trong 7 ngày tới mà không lo bị lệch ngày cố định
const TAKEN_SLOTS = [
  { mentorId: "m1", offsetDays: 0, time: "19:00" },
  { mentorId: "m1", offsetDays: 2, time: "20:00" },
  { mentorId: "m1", offsetDays: 5, time: "09:00" },
  { mentorId: "m2", offsetDays: 1, time: "19:00" },
  { mentorId: "m2", offsetDays: 3, time: "20:00" },
  { mentorId: "m3", offsetDays: 0, time: "18:00" },
  { mentorId: "m3", offsetDays: 2, time: "19:00" },
  { mentorId: "m4", offsetDays: 1, time: "09:00" },
  { mentorId: "m4", offsetDays: 4, time: "15:00" },
  { mentorId: "m5", offsetDays: 2, time: "20:00" },
  { mentorId: "m6", offsetDays: 1, time: "18:00" },
  { mentorId: "m7", offsetDays: 3, time: "19:00" },
  { mentorId: "m8", offsetDays: 1, time: "20:00" },
  { mentorId: "m9", offsetDays: 2, time: "19:00" },
  { mentorId: "m10", offsetDays: 1, time: "19:00" },
  { mentorId: "m11", offsetDays: 2, time: "18:00" },
  { mentorId: "m12", offsetDays: 1, time: "19:00" }
];

// 2 lịch hẹn mẫu sắp tới dùng để nạp lần đầu tiên cho người học (Nguyễn Minh Anh)
// offsetDays giúp tính ngày tự động theo ngày hiện tại của máy
const DEFAULT_SAMPLE_BOOKINGS_CONFIG = [
  {
    mentorId: "m1",
    mentorName: "Trần Hoàng Nam",
    offsetDays: 1, // Ngày mai
    time: "19:00",
    topic: "Review portfolio Frontend và định hướng phỏng vấn tuyển dụng",
    note: "Em đã chuẩn bị sẵn link GitHub và 2 dự án ReactJS muốn nhờ anh xem giúp cấu trúc thư mục và clean code.",
    meetingLink: "https://meet.example.com/mmc-nam-8f92a"
  },
  {
    mentorId: "m3",
    mentorName: "Phạm Minh Khoa",
    offsetDays: 3, // 3 ngày nữa
    time: "20:00",
    topic: "Góp ý UI/UX Case Study đồ án tốt nghiệp ứng dụng đặt lịch",
    note: "Em muốn trao đổi về trải nghiệm đặt lịch trên thiết bị di động và luồng thông báo nhắc nhở người dùng.",
    meetingLink: "https://meet.example.com/mmc-khoa-3b71c"
  }
];

// Gắn vào window để hỗ trợ cả truy cập trực tiếp lẫn qua window trong mọi môi trường
if (typeof window !== "undefined") {
  window.MENTEE = MENTEE;
  window.SKILLS = SKILLS;
  window.MENTORS = MENTORS;
  window.TAKEN_SLOTS = TAKEN_SLOTS;
  window.DEFAULT_SAMPLE_BOOKINGS_CONFIG = DEFAULT_SAMPLE_BOOKINGS_CONFIG;
}

