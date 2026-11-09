/**
 * Initial educational data for Backend API (Node.js / Express)
 * Synchronized with frontend staticData.js including Reading, Grammar, Irregular Verbs & Speaking
 */

const LEVELS = ["A1", "A2", "B1", "B2", "C1"];

const LEVEL_NAME = {
  A1: "Mới bắt đầu",
  A2: "Sơ cấp",
  B1: "Trung cấp",
  B2: "Trung cao cấp",
  C1: "Nâng cao"
};

const LEVEL_DESC = {
  A1: "Biết vài từ cơ bản, câu rất ngắn",
  A2: "Giao tiếp đơn giản hằng ngày",
  B1: "Đọc hiểu và viết đoạn ngắn khá ổn",
  B2: "Tự tin trong học tập, công việc",
  C1: "Dùng tiếng Anh linh hoạt, chính xác"
};

const TOPICS = {
  life: ["Đời sống", "daily life"],
  study: ["Học tập", "study and school"],
  work: ["Công việc", "work and office"],
  it: ["Công nghệ / IT", "technology and software"],
  travel: ["Du lịch", "travel"],
  food: ["Ẩm thực", "food and cooking"],
  health: ["Sức khoẻ", "health and fitness"],
  business: ["Kinh doanh", "business and money"],
  society: ["Xã hội", "society and environment"],
  fun: ["Giải trí", "movies, music and games"]
};

const MODES = {
  translate: ["Dịch Việt – Anh", "Viết bản tiếng Anh cho đoạn tiếng Việt, AI chấm và sửa lỗi."],
  vocab: ["Từ vựng", "Flashcard 3D, trắc nghiệm hoặc tự gõ từ, có hẹn giờ."],
  scramble: ["Sắp xếp câu", "Ghép các từ thành câu đúng ngữ pháp."],
  blank: ["Điền từ", "Ngữ pháp, giới từ, cụm từ thông dụng."],
  dictation: ["Nghe chép", "Nghe câu tiếng Anh rồi gõ lại."],
  reading: ["Đọc hiểu", "Đọc bài phân cấp A1-C1, tra từ trực tiếp và trả lời câu hỏi."],
  speaking: ["Luyện nói", "Luyện phát âm chuẩn bản xứ với chấm điểm nhận diện giọng nói."],
  grammar: ["Ngữ pháp", "Cẩm nang ngữ pháp CEFR và bảng động từ bất quy tắc."],
  chat: ["Hội thoại", "Trò chuyện nhập vai với AI theo kịch bản thực tế."]
};

const PRESETS = {
  A1: { vocabType: "choice", blankType: "choice", rate: 0.75, strictness: "easy", timer: 0, feedbackLang: "vi", hints: true, explain: "detailed", chatCorrection: "major", vocabCount: 5, range: "around" },
  A2: { vocabType: "choice", blankType: "choice", rate: 0.85, strictness: "easy", timer: 0, feedbackLang: "vi", hints: true, explain: "detailed", chatCorrection: "major", vocabCount: 10, range: "around" },
  B1: { vocabType: "mix", blankType: "type", rate: 0.95, strictness: "normal", timer: 0, feedbackLang: "vi", hints: true, explain: "short", chatCorrection: "all", vocabCount: 10, range: "around" },
  B2: { vocabType: "type", blankType: "type", rate: 1.0, strictness: "normal", timer: 20, feedbackLang: "both", hints: false, explain: "short", chatCorrection: "all", vocabCount: 15, range: "harder" },
  C1: { vocabType: "type", blankType: "type", rate: 1.1, strictness: "strict", timer: 15, feedbackLang: "en", hints: false, explain: "short", chatCorrection: "all", vocabCount: 15, range: "around" }
};

const PASSAGES = [
  { id: 1, lv: "A1", vi: "Tôi tên là Nam. Tôi là sinh viên. Tôi thích chơi bóng đá.", en: "My name is Nam. I am a student. I like playing football.", kw: "sinh viên = student; bóng đá = football" },
  { id: 2, lv: "A1", vi: "Đây là mẹ tôi. Bà ấy là giáo viên. Bà ấy rất tốt bụng.", en: "This is my mother. She is a teacher. She is very kind.", kw: "giáo viên = teacher; tốt bụng = kind" },
  { id: 3, lv: "A1", vi: "Hôm nay trời nắng. Tôi đi công viên với bạn của tôi.", en: "It is sunny today. I go to the park with my friend.", kw: "nắng = sunny; công viên = park" },
  { id: 4, lv: "A2", vi: "Mỗi sáng, tôi thức dậy lúc sáu giờ và uống một cốc nước. Sau đó tôi đi bộ quanh công viên gần nhà khoảng hai mươi phút.", en: "Every morning, I wake up at six o'clock and drink a glass of water. Then I walk around the park near my house for about twenty minutes.", kw: "thức dậy = wake up; cốc = glass; đi bộ quanh = walk around" },
  { id: 5, lv: "A2", vi: "Em gái tôi rất thích nấu ăn. Cuối tuần, cô ấy thường làm bánh cho cả gia đình.", en: "My younger sister loves cooking. On weekends, she often bakes cakes for the whole family.", kw: "em gái = younger sister; làm bánh = bake cakes; cả gia đình = the whole family" },
  { id: 6, lv: "A2", vi: "Hôm qua trời mưa to nên chúng tôi ở nhà xem phim và chơi cờ.", en: "It rained heavily yesterday, so we stayed at home, watched movies and played chess.", kw: "mưa to = rain heavily; chơi cờ = play chess" },
  { id: 7, lv: "B1", vi: "Tôi đang học kỹ thuật phần mềm tại một trường đại học ở Thành phố Hồ Chí Minh. Môn học tôi thích nhất là lập trình Java vì nó giúp tôi hiểu cách xây dựng ứng dụng lớn.", en: "I am studying software engineering at a university in Ho Chi Minh City. My favorite subject is Java programming because it helps me understand how to build large applications.", kw: "kỹ thuật phần mềm = software engineering; môn học = subject; ứng dụng = application" },
  { id: 8, lv: "B1", vi: "Làm việc nhóm không phải lúc nào cũng dễ dàng. Mỗi thành viên có ý kiến khác nhau, vì vậy chúng ta cần lắng nghe và tìm ra giải pháp chung.", en: "Teamwork is not always easy. Each member has different opinions, so we need to listen and find a common solution.", kw: "làm việc nhóm = teamwork; ý kiến = opinion; giải pháp chung = common solution" },
  { id: 9, lv: "B1", vi: "Nếu bạn muốn cải thiện tiếng Anh, hãy đọc một chút mỗi ngày. Thói quen nhỏ nhưng đều đặn sẽ mang lại kết quả lớn.", en: "If you want to improve your English, read a little every day. Small but consistent habits will bring great results.", kw: "cải thiện = improve; đều đặn = consistent; thói quen = habit" },
  { id: 10, lv: "B2", vi: "Mặc dù công nghệ giúp cuộc sống tiện lợi hơn, nhiều người lo ngại rằng việc phụ thuộc quá nhiều vào điện thoại đang làm giảm khả năng tập trung của chúng ta.", en: "Although technology makes life more convenient, many people worry that relying too much on smartphones is reducing our ability to concentrate.", kw: "tiện lợi = convenient; phụ thuộc vào = rely on; khả năng tập trung = ability to concentrate" },
  { id: 11, lv: "B2", vi: "Trước khi phát hành phiên bản mới, đội ngũ kiểm thử phải đảm bảo rằng mọi lỗi nghiêm trọng đã được sửa và hệ thống hoạt động ổn định dưới tải cao.", en: "Before releasing a new version, the testing team must make sure that all critical bugs have been fixed and the system runs stably under heavy load.", kw: "phát hành = release; lỗi nghiêm trọng = critical bug; tải cao = heavy load" },
  { id: 12, lv: "B2", vi: "Nhiều công ty hiện nay cho phép nhân viên làm việc từ xa, điều này giúp tiết kiệm thời gian đi lại nhưng cũng đòi hỏi tính kỷ luật cao.", en: "Many companies now allow employees to work remotely, which saves commuting time but also requires a high level of self-discipline.", kw: "làm việc từ xa = work remotely; thời gian đi lại = commuting time; kỷ luật = self-discipline" },
  { id: 13, lv: "C1", vi: "Việc quản lý thời gian hiệu quả không có nghĩa là làm nhiều việc hơn, mà là biết việc nào quan trọng và dành năng lượng cho nó.", en: "Managing time effectively does not mean doing more things; it means knowing which tasks matter and devoting your energy to them.", kw: "quản lý thời gian = time management; dành năng lượng cho = devote energy to" },
  { id: 14, lv: "C1", vi: "Thay vì chạy theo những xu hướng nhất thời, các nhà phát triển nên tập trung xây dựng nền tảng vững chắc, bởi kiến thức cốt lõi hiếm khi lỗi thời.", en: "Rather than chasing short-lived trends, developers should focus on building a solid foundation, since core knowledge rarely becomes obsolete.", kw: "xu hướng nhất thời = short-lived trend; nền tảng vững chắc = solid foundation; lỗi thời = obsolete" },
  { id: 15, lv: "C1", vi: "Việc đầu tư mạnh vào giáo dục kỹ thuật số được kỳ vọng sẽ thu hẹp khoảng cách giữa thành thị và nông thôn, dù vẫn còn nhiều thách thức về cơ sở hạ tầng.", en: "Heavy investment in digital education is expected to narrow the gap between urban and rural areas, although many infrastructure challenges remain.", kw: "thu hẹp khoảng cách = narrow the gap; thành thị và nông thôn = urban and rural areas; cơ sở hạ tầng = infrastructure" }
];

const VOCAB = {
  A1: [
    { en: "apple", vi: "quả táo", ipa: "/ˈæp.əl/", pos: "noun", ex: "She eats a red apple every day.", exVi: "Cô ấy ăn một quả táo đỏ mỗi ngày." },
    { en: "book", vi: "quyển sách", ipa: "/bʊk/", pos: "noun", ex: "I am reading an interesting book.", exVi: "Tôi đang đọc một quyển sách thú vị." },
    { en: "family", vi: "gia đình", ipa: "/ˈfæm.əl.i/", pos: "noun", ex: "My family lives in Ho Chi Minh City.", exVi: "Gia đình tôi sống ở TP. Hồ Chí Minh." },
    { en: "friend", vi: "bạn bè", ipa: "/frend/", pos: "noun", ex: "He is my best friend at school.", exVi: "Cậu ấy là bạn thân nhất của tôi ở trường." },
    { en: "happy", vi: "vui vẻ", ipa: "/ˈhæp.i/", pos: "adj", ex: "We are very happy to see you.", exVi: "Chúng tôi rất vui khi gặp bạn." },
    { en: "house", vi: "ngôi nhà", ipa: "/haʊs/", pos: "noun", ex: "Their house has a small garden.", exVi: "Ngôi nhà của họ có một khu vườn nhỏ." },
    { en: "morning", vi: "buổi sáng", ipa: "/ˈmɔːr.nɪŋ/", pos: "noun", ex: "I drink coffee in the morning.", exVi: "Tôi uống cà phê vào buổi sáng." },
    { en: "eat", vi: "ăn", ipa: "/iːt/", pos: "verb", ex: "We usually eat dinner at 7 PM.", exVi: "Chúng tôi thường ăn tối lúc 7 giờ." },
    { en: "water", vi: "nước", ipa: "/ˈwɔː.tər/", pos: "noun", ex: "Please give me a glass of water.", exVi: "Làm ơn cho tôi một cốc nước." },
    { en: "teacher", vi: "giáo viên", ipa: "/ˈtiː.tʃər/", pos: "noun", ex: "Our English teacher is very patient.", exVi: "Giáo viên tiếng Anh của chúng tôi rất kiên nhẫn." },
    { en: "big", vi: "to, lớn", ipa: "/bɪɡ/", pos: "adj", ex: "They work in a big building.", exVi: "Họ làm việc trong một tòa nhà lớn." },
    { en: "cold", vi: "lạnh", ipa: "/koʊld/", pos: "adj", ex: "The weather is cold in December.", exVi: "Thời tiết lạnh vào tháng Mười Hai." }
  ],
  A2: [
    { en: "borrow", vi: "mượn", ipa: "/ˈbɑːr.oʊ/", pos: "verb", ex: "Can I borrow your pen for a minute?", exVi: "Tôi có thể mượn bút của bạn một chút không?" },
    { en: "habit", vi: "thói quen", ipa: "/ˈhæb.ɪt/", pos: "noun", ex: "Reading before bed is a good habit.", exVi: "Đọc sách trước khi ngủ là một thói quen tốt." },
    { en: "journey", vi: "hành trình", ipa: "/ˈdʒɜːr.ni/", pos: "noun", ex: "The train journey took four hours.", exVi: "Hành trình bằng tàu hỏa mất bốn tiếng." },
    { en: "schedule", vi: "lịch trình", ipa: "/ˈskedʒ.uːl/", pos: "noun", ex: "I have a busy schedule this week.", exVi: "Tôi có lịch trình bận rộn trong tuần này." },
    { en: "tidy", vi: "gọn gàng", ipa: "/ˈtaɪ.di/", pos: "adj", ex: "She always keeps her desk tidy.", exVi: "Cô ấy luôn giữ bàn làm việc gọn gàng." },
    { en: "describe", vi: "mô tả", ipa: "/dɪˈskraɪb/", pos: "verb", ex: "Can you describe what happened?", exVi: "Bạn có thể mô tả chuyện gì đã xảy ra không?" },
    { en: "familiar", vi: "quen thuộc", ipa: "/fəˈmɪl.jər/", pos: "adj", ex: "His voice sounds very familiar to me.", exVi: "Giọng anh ấy nghe rất quen thuộc với tôi." },
    { en: "ingredient", vi: "nguyên liệu", ipa: "/ɪnˈɡriː.di.ənt/", pos: "noun", ex: "Fresh herbs are the main ingredient.", exVi: "Thảo mộc tươi là nguyên liệu chính." },
    { en: "suggest", vi: "gợi ý", ipa: "/səɡˈdʒest/", pos: "verb", ex: "Where do you suggest we have lunch?", exVi: "Bạn gợi ý chúng ta ăn trưa ở đâu?" },
    { en: "weather", vi: "thời tiết", ipa: "/ˈweð.ər/", pos: "noun", ex: "The weather forecast says it will rain.", exVi: "Dự báo thời tiết nói trời sẽ mưa." },
    { en: "cheap", vi: "rẻ", ipa: "/tʃiːp/", pos: "adj", ex: "Street food here is delicious and cheap.", exVi: "Đồ ăn đường phố ở đây ngon và rẻ." },
    { en: "invite", vi: "mời", ipa: "/ɪnˈvaɪt/", pos: "verb", ex: "We invited twenty guests to the party.", exVi: "Chúng tôi đã mời hai mươi vị khách tới bữa tiệc." }
  ],
  B1: [
    { en: "achieve", vi: "đạt được", ipa: "/əˈtʃiːv/", pos: "verb", ex: "She worked hard to achieve her goals.", exVi: "Cô ấy đã làm việc chăm chỉ để đạt được mục tiêu." },
    { en: "confident", vi: "tự tin", ipa: "/ˈkɑːn.fə.dənt/", pos: "adj", ex: "Practice makes you more confident in speaking.", exVi: "Luyện tập giúp bạn tự tin hơn khi nói." },
    { en: "deadline", vi: "hạn chót", ipa: "/ˈded.laɪn/", pos: "noun", ex: "We must submit the report before the deadline.", exVi: "Chúng ta phải nộp báo cáo trước hạn chót." },
    { en: "improve", vi: "cải thiện", ipa: "/ɪmˈpruːv/", pos: "verb", ex: "Daily listening will improve your pronunciation.", exVi: "Nghe hàng ngày sẽ cải thiện phát âm của bạn." },
    { en: "knowledge", vi: "kiến thức", ipa: "/ˈnɑː.lɪdʒ/", pos: "noun", ex: "Sharing knowledge helps the whole team grow.", exVi: "Chia sẻ kiến thức giúp cả nhóm cùng phát triển." },
    { en: "opportunity", vi: "cơ hội", ipa: "/ˌɑː.pərˈtuː.nə.ti/", pos: "noun", ex: "This internship is a great opportunity.", exVi: "Kỳ thực tập này là một cơ hội tuyệt vời." },
    { en: "patient", vi: "kiên nhẫn", ipa: "/ˈpeɪ.ʃənt/", pos: "adj", ex: "Be patient with yourself when learning a language.", exVi: "Hãy kiên nhẫn với bản thân khi học ngoại ngữ." },
    { en: "require", vi: "yêu cầu", ipa: "/rɪˈkwaɪr/", pos: "verb", ex: "This position requires strong communication skills.", exVi: "Vị trí này yêu cầu kỹ năng giao tiếp tốt." },
    { en: "colleague", vi: "đồng nghiệp", ipa: "/ˈkɑː.liːɡ/", pos: "noun", ex: "I discussed the issue with my colleague.", exVi: "Tôi đã thảo luận vấn đề này với đồng nghiệp." },
    { en: "encourage", vi: "khuyến khích", ipa: "/ɪnˈkɜːr.ɪdʒ/", pos: "verb", ex: "My parents always encourage me to try new things.", exVi: "Bố mẹ luôn khuyến khích tôi thử những điều mới." },
    { en: "grateful", vi: "biết ơn", ipa: "/ˈɡreɪt.fəl/", pos: "adj", ex: "I am grateful for your helpful feedback.", exVi: "Tôi rất biết ơn những góp ý hữu ích của bạn." },
    { en: "previous", vi: "trước đó", ipa: "/ˈpriː.vi.əs/", pos: "adj", ex: "Do you have any previous experience in design?", exVi: "Bạn có kinh nghiệm trước đó về thiết kế không?" }
  ],
  B2: [
    { en: "efficient", vi: "hiệu quả, năng suất", ipa: "/ɪˈfɪʃ.ənt/", pos: "adj", ex: "The new algorithm is much more efficient.", exVi: "Thuật toán mới hoạt động hiệu quả hơn nhiều." },
    { en: "negotiate", vi: "đàm phán", ipa: "/nəˈɡoʊ.ʃi.eɪt/", pos: "verb", ex: "They managed to negotiate a better contract.", exVi: "Họ đã đàm phán thành công một hợp đồng tốt hơn." },
    { en: "maintain", vi: "duy trì", ipa: "/meɪnˈteɪn/", pos: "verb", ex: "It is important to maintain a healthy work-life balance.", exVi: "Việc duy trì cân bằng công việc và cuộc sống rất quan trọng." },
    { en: "reliable", vi: "đáng tin cậy", ipa: "/rɪˈlaɪ.ə.bəl/", pos: "adj", ex: "We need a reliable server for production.", exVi: "Chúng ta cần một máy chủ đáng tin cậy cho môi trường thực tế." },
    { en: "temporary", vi: "tạm thời", ipa: "/ˈtem.pə.rer.i/", pos: "adj", ex: "This is only a temporary workaround.", exVi: "Đây chỉ là một giải pháp khắc phục tạm thời." },
    { en: "approach", vi: "cách tiếp cận", ipa: "/əˈproʊtʃ/", pos: "noun", ex: "We adopted a user-centered approach to design.", exVi: "Chúng tôi áp dụng cách tiếp cận lấy người dùng làm trung tâm." },
    { en: "budget", vi: "ngân sách", ipa: "/ˈbʌdʒ.ɪt/", pos: "noun", ex: "The project was completed on time and under budget.", exVi: "Dự án hoàn thành đúng hạn và trong ngân sách." },
    { en: "hesitate", vi: "do dự, ngần ngại", ipa: "/ˈhez.ə.teɪt/", pos: "verb", ex: "Please do not hesitate to contact us.", exVi: "Xin đừng ngần ngại liên hệ với chúng tôi." },
    { en: "deploy", vi: "triển khai", ipa: "/dɪˈplɔɪ/", pos: "verb", ex: "We will deploy the update tonight.", exVi: "Chúng tôi sẽ triển khai bản cập nhật vào tối nay." },
    { en: "valuable", vi: "có giá trị, quý giá", ipa: "/ˈvæl.jə.bəl/", pos: "adj", ex: "User feedback provides valuable insights.", exVi: "Phản hồi của người dùng mang lại góc nhìn quý giá." },
    { en: "urgent", vi: "khẩn cấp", ipa: "/ˈɜːr.dʒənt/", pos: "adj", ex: "There is an urgent security patch to apply.", exVi: "Có một bản vá bảo mật khẩn cấp cần áp dụng." },
    { en: "consistent", vi: "nhất quán, kiên trì", ipa: "/kənˈsɪs.tənt/", pos: "adj", ex: "Consistent design tokens make UI predictable.", exVi: "Design token nhất quán giúp giao diện dễ đoán." }
  ],
  C1: [
    { en: "meticulous", vi: "tỉ mỉ, kỹ lưỡng", ipa: "/məˈtɪk.jə.ləs/", pos: "adj", ex: "She is meticulous about code quality and testing.", exVi: "Cô ấy rất tỉ mỉ về chất lượng mã nguồn và kiểm thử." },
    { en: "ambiguous", vi: "mơ hồ, nhập nhằng", ipa: "/æmˈbɪɡ.ju.əs/", pos: "adj", ex: "Avoid ambiguous requirements in technical specs.", exVi: "Hãy tránh các yêu cầu mơ hồ trong tài liệu kỹ thuật." },
    { en: "mitigate", vi: "giảm thiểu, làm dịu", ipa: "/ˈmɪt.ə.ɡeɪt/", pos: "verb", ex: "Automated backups help mitigate data loss risks.", exVi: "Sao lưu tự động giúp giảm thiểu rủi ro mất dữ liệu." },
    { en: "scrutinize", vi: "xem xét kỹ lưỡng", ipa: "/ˈskruː.tən.aɪz/", pos: "verb", ex: "Auditors scrutinized every financial transaction.", exVi: "Kiểm toán viên đã xem xét kỹ lưỡng mọi giao dịch tài chính." },
    { en: "obsolete", vi: "lỗi thời", ipa: "/ˌɑːb.səˈliːt/", pos: "adj", ex: "Legacy protocols quickly become obsolete.", exVi: "Các giao thức cũ nhanh chóng trở nên lỗi thời." },
    { en: "compelling", vi: "thuyết phục, hấp dẫn", ipa: "/kəmˈpel.ɪŋ/", pos: "adj", ex: "He presented a compelling argument for the redesign.", exVi: "Anh ấy đã đưa ra lập luận thuyết phục cho việc thiết kế lại." },
    { en: "inevitable", vi: "không thể tránh khỏi", ipa: "/ɪˈnev.ə.tə.bəl/", pos: "adj", ex: "Change is inevitable in the software industry.", exVi: "Sự thay đổi là điều không thể tránh khỏi trong ngành phần mềm." },
    { en: "leverage", vi: "tận dụng, phát huy", ipa: "/ˈlev.ər.ɪdʒ/", pos: "verb", ex: "Teams can leverage AI to speed up routine workflows.", exVi: "Các nhóm có thể tận dụng AI để tăng tốc quy trình lặp lại." },
    { en: "comprehensive", vi: "toàn diện, đầy đủ", ipa: "/ˌkɑːm.prəˈhen.sɪv/", pos: "adj", ex: "We wrote a comprehensive guide for new developers.", exVi: "Chúng tôi đã viết hướng dẫn toàn diện cho lập trình viên mới." },
    { en: "discrepancy", vi: "sự chênh lệch, khác biệt", ipa: "/dɪˈskrep.ən.si/", pos: "noun", ex: "There is a discrepancy between the two reports.", exVi: "Có sự chênh lệch giữa hai bản báo cáo." },
    { en: "resilient", vi: "kiên cường, bền bỉ", ipa: "/rɪˈzɪl.jənt/", pos: "adj", ex: "We built a resilient architecture with offline fallback.", exVi: "Chúng tôi xây dựng kiến trúc bền bỉ có chế độ dự phòng ngoại tuyến." },
    { en: "advocate", vi: "ủng hộ, tán thành", ipa: "/ˈæd.və.keɪt/", pos: "verb", ex: "Design systems advocate accessibility from day one.", exVi: "Hệ thống thiết kế đề cao tính tiếp cận ngay từ ngày đầu." }
  ]
};

const SENTENCES = {
  A1: [
    { en: "I like green tea.", vi: "Tôi thích trà xanh." },
    { en: "She has a small cat.", vi: "Cô ấy có một con mèo nhỏ." },
    { en: "We go to school every day.", vi: "Chúng tôi đi học mỗi ngày." },
    { en: "My father is a doctor.", vi: "Bố tôi là bác sĩ." },
    { en: "They live in a big city.", vi: "Họ sống ở một thành phố lớn." }
  ],
  A2: [
    { en: "What do you usually do in your free time?", vi: "Bạn thường làm gì vào thời gian rảnh?" },
    { en: "She usually goes to the gym after work.", vi: "Cô ấy thường đến phòng tập sau giờ làm." },
    { en: "My laptop is much faster than my old one.", vi: "Laptop của tôi nhanh hơn nhiều so với cái cũ." },
    { en: "It rained a lot last weekend.", vi: "Cuối tuần trước trời mưa nhiều." },
    { en: "We are planning a trip to Da Nang next month.", vi: "Chúng tôi đang lên kế hoạch đi Đà Nẵng vào tháng tới." }
  ],
  B1: [
    { en: "I have been learning English for three years.", vi: "Tôi đã học tiếng Anh được ba năm." },
    { en: "If it rains tomorrow, we will stay at home.", vi: "Nếu mai trời mưa, chúng tôi sẽ ở nhà." },
    { en: "We should finish this task before Friday.", vi: "Chúng ta nên hoàn thành việc này trước thứ Sáu." },
    { en: "Could you tell me where the station is?", vi: "Bạn có thể cho tôi biết nhà ga ở đâu không?" },
    { en: "Learning a new skill takes time and patience.", vi: "Học một kỹ năng mới cần thời gian và sự kiên nhẫn." }
  ],
  B2: [
    { en: "The bug was fixed by our team last night.", vi: "Lỗi đó đã được nhóm chúng tôi sửa tối qua." },
    { en: "He is the most careful person I have ever met.", vi: "Anh ấy là người cẩn thận nhất tôi từng gặp." },
    { en: "I am not used to waking up so early.", vi: "Tôi không quen dậy sớm như vậy." },
    { en: "Had I known about the meeting, I would have joined.", vi: "Nếu tôi biết về cuộc họp thì tôi đã tham gia rồi." },
    { en: "Clear documentation saves hours of debugging later.", vi: "Tài liệu rõ ràng giúp tiết kiệm hàng giờ gỡ lỗi về sau." }
  ],
  C1: [
    { en: "Not only did she finish the project early, but she also improved its performance.", vi: "Cô ấy không chỉ hoàn thành dự án sớm mà còn cải thiện hiệu năng của nó." },
    { en: "The proposal, which had been rejected twice, was finally approved.", vi: "Đề xuất từng bị từ chối hai lần cuối cùng đã được phê duyệt." },
    { en: "Rarely have I seen such a well-organized team.", vi: "Hiếm khi tôi thấy một đội làm việc có tổ chức như vậy." },
    { en: "It is high time we reconsidered our approach to testing.", vi: "Đã đến lúc chúng ta xem xét lại cách tiếp cận việc kiểm thử." }
  ]
};

const BLANKS = {
  A1: [
    { s: "I ___ a student.", a: "am", h: "Động từ to be với I", cat: "To Be", alt: [], d: ["is", "are", "be"] },
    { s: "She ___ two brothers.", a: "has", h: "have / has", cat: "Present Simple", alt: [], d: ["have", "is", "having"] },
    { s: "There ___ a book on the table.", a: "is", h: "There is / There are", cat: "There is/are", alt: [], d: ["are", "am", "be"] },
    { s: "I go to school ___ bus.", a: "by", h: "Phương tiện đi lại", cat: "Prepositions", alt: [], d: ["on", "in", "with"] }
  ],
  A2: [
    { s: "Please turn ___ the lights when you leave.", a: "off", h: "Tắt (đèn, máy)", cat: "Phrasal Verbs", alt: [], d: ["on", "up", "in"] },
    { s: "It's ___ cold to go swimming today.", a: "too", h: "Quá… để làm gì", cat: "Structures", alt: [], d: ["very", "so", "enough"] },
    { s: "She is interested ___ learning Japanese.", a: "in", h: "interested + giới từ", cat: "Collocations", alt: [], d: ["on", "at", "for"] },
    { s: "They ___ playing football when it started to rain.", a: "were", h: "Quá khứ tiếp diễn", cat: "Past Continuous", alt: [], d: ["was", "are", "did"] }
  ],
  B1: [
    { s: "She has lived here ___ 2020.", a: "since", h: "Mốc thời gian bắt đầu", cat: "Present Perfect", alt: [], d: ["for", "from", "during"] },
    { s: "I'm looking forward ___ seeing you.", a: "to", h: "look forward + giới từ", cat: "Phrasal Verbs", alt: [], d: ["for", "at", "in"] },
    { s: "He is good ___ solving problems.", a: "at", h: "good + giới từ", cat: "Adjective + Prep", alt: [], d: ["in", "on", "with"] },
    { s: "The project depends ___ everyone's effort.", a: "on", h: "depend + giới từ", cat: "Verb + Prep", alt: ["upon"], d: ["in", "of", "at"] }
  ],
  B2: [
    { s: "If I ___ you, I would accept the offer.", a: "were", h: "Câu điều kiện loại 2", cat: "Conditionals", alt: [], d: ["am", "was being", "will be"] },
    { s: "This is the book ___ I told you about.", a: "which", h: "Đại từ quan hệ", cat: "Relative Clauses", alt: ["that"], d: ["who", "whose", "what"] },
    { s: "We need to ___ up a meeting with the client.", a: "set", h: "Cụm động từ: sắp xếp, thiết lập", cat: "Phrasal Verbs", alt: [], d: ["put", "take", "make"] },
    { s: "I've already ___ my homework.", a: "finished", h: "Hiện tại hoàn thành", cat: "Present Perfect", alt: ["done"], d: ["finish", "finishing", "did"] }
  ],
  C1: [
    { s: "Hardly ___ I arrived when the meeting started.", a: "had", h: "Đảo ngữ với Hardly", cat: "Inversion", alt: [], d: ["did", "have", "was"] },
    { s: "The results were ___ with our expectations.", a: "consistent", h: "Tính từ + with: nhất quán", cat: "Collocations", alt: [], d: ["constant", "persistent", "consequent"] },
    { s: "She took the criticism ___ her stride.", a: "in", h: "Thành ngữ: bình thản đón nhận", cat: "Idioms", alt: [], d: ["on", "with", "at"] },
    { s: "___ the circumstances, we did our best.", a: "given", h: "Xét đến, với điều kiện", cat: "Connectors", alt: ["considering"], d: ["giving", "despite", "although"] }
  ]
};

const PLACEMENT_TEST = [
  { id: 1, lv: "A1", q: "She ___ a teacher.", o: ["is", "are", "am", "be"] },
  { id: 2, lv: "A1", q: "I ___ coffee every morning.", o: ["drink", "drinks", "drinking", "am drink"] },
  { id: 3, lv: "A1", q: "Chọn nghĩa của từ \"family\":", o: ["gia đình", "bạn bè", "trường học", "công việc"] },
  { id: 4, lv: "A2", q: "Yesterday I ___ to the cinema with my friends.", o: ["went", "go", "gone", "have gone"] },
  { id: 5, lv: "A2", q: "This bag is ___ than that one.", o: ["cheaper", "cheapest", "more cheap", "the cheaper"] },
  { id: 6, lv: "A2", q: "There isn't ___ milk in the fridge.", o: ["any", "some", "many", "a"] },
  { id: 7, lv: "B1", q: "I have lived here ___ five years.", o: ["for", "since", "during", "from"] },
  { id: 8, lv: "B1", q: "If it ___ tomorrow, we will cancel the trip.", o: ["rains", "will rain", "rained", "is raining"] },
  { id: 9, lv: "B1", q: "Từ \"reliable\" có nghĩa là:", o: ["đáng tin cậy", "dễ thay đổi", "đắt đỏ", "nhanh chóng"] },
  { id: 10, lv: "B2", q: "By the time the manager arrived, the report ___.", o: ["had been finished", "has finished", "was finishing", "finishes"] },
  { id: 11, lv: "B2", q: "She suggested ___ the meeting until Monday.", o: ["postponing", "to postpone", "postpone", "postponed"] },
  { id: 12, lv: "B2", q: "I wish I ___ more time to travel last year.", o: ["had had", "have had", "would have", "have"] },
  { id: 13, lv: "C1", q: "Rarely ___ such a talented developer.", o: ["have I met", "I have met", "I met", "did I met"] },
  { id: 14, lv: "C1", q: "Had we left earlier, we ___ the train.", o: ["would have caught", "would catch", "will catch", "caught"] },
  { id: 15, lv: "C1", q: "Từ \"ambiguous\" gần nghĩa nhất với:", o: ["unclear", "ambitious", "obvious", "enormous"] }
];

module.exports = {
  LEVELS,
  LEVEL_NAME,
  LEVEL_DESC,
  TOPICS,
  MODES,
  PRESETS,
  PASSAGES,
  VOCAB,
  SENTENCES,
  BLANKS,
  PLACEMENT_TEST
};
