export const LEVELS = ["A1", "A2", "B1", "B2", "C1"];

export const LEVEL_NAME = {
  A1: "Mới bắt đầu",
  A2: "Sơ cấp",
  B1: "Trung cấp",
  B2: "Trung cao cấp",
  C1: "Nâng cao"
};

export const LEVEL_DESC = {
  A1: "Biết vài từ cơ bản, câu rất ngắn",
  A2: "Giao tiếp đơn giản hằng ngày",
  B1: "Đọc hiểu và viết đoạn ngắn khá ổn",
  B2: "Tự tin trong học tập, công việc",
  C1: "Dùng tiếng Anh linh hoạt, chính xác"
};

export const LEVEL_COLORS = {
  A1: { bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800" },
  A2: { bg: "bg-teal-50 dark:bg-teal-950/40", text: "text-teal-700 dark:text-teal-400", border: "border-teal-200 dark:border-teal-800" },
  B1: { bg: "bg-blue-50 dark:bg-blue-950/40", text: "text-blue-700 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800" },
  B2: { bg: "bg-indigo-50 dark:bg-indigo-950/40", text: "text-indigo-700 dark:text-indigo-400", border: "border-indigo-200 dark:border-indigo-800" },
  C1: { bg: "bg-purple-50 dark:bg-purple-950/40", text: "text-purple-700 dark:text-purple-400", border: "border-purple-200 dark:border-purple-800" }
};

export const TOPICS = {
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

export const PRESETS = {
  A1: { vocabType: "choice", blankType: "choice", rate: 0.75, strictness: "easy", timer: 0, feedbackLang: "vi", hints: true, explain: "detailed", chatCorrection: "major", vocabCount: 5, range: "around" },
  A2: { vocabType: "choice", blankType: "choice", rate: 0.85, strictness: "easy", timer: 0, feedbackLang: "vi", hints: true, explain: "detailed", chatCorrection: "major", vocabCount: 10, range: "around" },
  B1: { vocabType: "mix", blankType: "type", rate: 0.95, strictness: "normal", timer: 0, feedbackLang: "vi", hints: true, explain: "short", chatCorrection: "all", vocabCount: 10, range: "around" },
  B2: { vocabType: "type", blankType: "type", rate: 1.0, strictness: "normal", timer: 20, feedbackLang: "both", hints: false, explain: "short", chatCorrection: "all", vocabCount: 15, range: "harder" },
  C1: { vocabType: "type", blankType: "type", rate: 1.1, strictness: "strict", timer: 15, feedbackLang: "en", hints: false, explain: "short", chatCorrection: "all", vocabCount: 15, range: "around" }
};

export const STATIC_PASSAGES = [
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

export const STATIC_VOCAB = {
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
    { en: "cold", vi: "lạnh", ipa: "/koʊld/", pos: "adj", ex: "The weather is cold in December.", exVi: "Thời tiết lạnh vào tháng Mười Hai." },
    { en: "listen", vi: "lắng nghe", ipa: "/ˈlɪs.ən/", pos: "verb", ex: "I listen to English podcasts every night.", exVi: "Tôi nghe podcast tiếng Anh mỗi tối." },
    { en: "kitchen", vi: "nhà bếp", ipa: "/ˈkɪtʃ.ən/", pos: "noun", ex: "My mom is cooking in the kitchen.", exVi: "Mẹ tôi đang nấu ăn trong bếp." }
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
    { en: "invite", vi: "mời", ipa: "/ɪnˈvaɪt/", pos: "verb", ex: "We invited twenty guests to the party.", exVi: "Chúng tôi đã mời hai mươi vị khách tới bữa tiệc." },
    { en: "appointment", vi: "cuộc hẹn", ipa: "/əˈpɔɪnt.mənt/", pos: "noun", ex: "I have a dentist appointment at 3 PM.", exVi: "Tôi có lịch hẹn nha sĩ lúc 3 giờ chiều." },
    { en: "comfortable", vi: "thoải mái", ipa: "/ˈkʌm.fər.tə.bəl/", pos: "adj", ex: "This office chair is very comfortable.", exVi: "Chiếc ghế văn phòng này rất thoải mái." }
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
    { en: "previous", vi: "trước đó", ipa: "/ˈpriː.vi.əs/", pos: "adj", ex: "Do you have any previous experience in design?", exVi: "Bạn có kinh nghiệm trước đó về thiết kế không?" },
    { en: "flexible", vi: "linh hoạt", ipa: "/ˈflek.sə.bəl/", pos: "adj", ex: "Our company offers flexible working hours.", exVi: "Công ty chúng tôi cung cấp giờ làm việc linh hoạt." },
    { en: "solution", vi: "giải pháp", ipa: "/səˈluː.ʃən/", pos: "noun", ex: "Let's find a practical solution to this problem.", exVi: "Hãy tìm một giải pháp thực tế cho vấn đề này." }
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
    { en: "consistent", vi: "nhất quán, kiên trì", ipa: "/kənˈsɪs.tənt/", pos: "adj", ex: "Consistent design tokens make UI predictable.", exVi: "Design token nhất quán giúp giao diện dễ đoán." },
    { en: "collaborate", vi: "hợp tác, cộng tác", ipa: "/kəˈlæb.ə.reɪt/", pos: "verb", ex: "Engineers and designers collaborate closely here.", exVi: "Kỹ sư và nhà thiết kế hợp tác chặt chẽ tại đây." },
    { en: "prioritize", vi: "ưu tiên", ipa: "/praɪˈɔːr.ə.taɪz/", pos: "verb", ex: "You should prioritize high-impact tasks first.", exVi: "Bạn nên ưu tiên các công việc có tác động lớn trước." }
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

export const STATIC_SENTENCES = {
  A1: [
    { en: "I like green tea.", vi: "Tôi thích trà xanh." },
    { en: "She has a small cat.", vi: "Cô ấy có một con mèo nhỏ." },
    { en: "We go to school every day.", vi: "Chúng tôi đi học mỗi ngày." },
    { en: "My father is a doctor.", vi: "Bố tôi là bác sĩ." },
    { en: "They live in a big city.", vi: "Họ sống ở một thành phố lớn." },
    { en: "Can you open the window please?", vi: "Bạn có thể mở cửa sổ giúp tôi được không?" }
  ],
  A2: [
    { en: "What do you usually do in your free time?", vi: "Bạn thường làm gì vào thời gian rảnh?" },
    { en: "She usually goes to the gym after work.", vi: "Cô ấy thường đến phòng tập sau giờ làm." },
    { en: "My laptop is much faster than my old one.", vi: "Laptop của tôi nhanh hơn nhiều so với cái cũ." },
    { en: "It rained a lot last weekend.", vi: "Cuối tuần trước trời mưa nhiều." },
    { en: "We are planning a trip to Da Nang next month.", vi: "Chúng tôi đang lên kế hoạch đi Đà Nẵng vào tháng tới." },
    { en: "Don't forget to bring your umbrella today.", vi: "Đừng quên mang theo ô hôm nay nhé." }
  ],
  B1: [
    { en: "I have been learning English for three years.", vi: "Tôi đã học tiếng Anh được ba năm." },
    { en: "If it rains tomorrow, we will stay at home.", vi: "Nếu mai trời mưa, chúng tôi sẽ ở nhà." },
    { en: "We should finish this task before Friday.", vi: "Chúng ta nên hoàn thành việc này trước thứ Sáu." },
    { en: "Could you tell me where the station is?", vi: "Bạn có thể cho tôi biết nhà ga ở đâu không?" },
    { en: "Learning a new skill takes time and patience.", vi: "Học một kỹ năng mới cần thời gian và sự kiên nhẫn." },
    { en: "She advised me to review vocabulary every morning.", vi: "Cô ấy khuyên tôi nên ôn từ vựng vào mỗi buổi sáng." }
  ],
  B2: [
    { en: "The bug was fixed by our team last night.", vi: "Lỗi đó đã được nhóm chúng tôi sửa tối qua." },
    { en: "He is the most careful person I have ever met.", vi: "Anh ấy là người cẩn thận nhất tôi từng gặp." },
    { en: "I am not used to waking up so early.", vi: "Tôi không quen dậy sớm như vậy." },
    { en: "Had I known about the meeting, I would have joined.", vi: "Nếu tôi biết về cuộc họp thì tôi đã tham gia rồi." },
    { en: "Clear documentation saves hours of debugging later.", vi: "Tài liệu rõ ràng giúp tiết kiệm hàng giờ gỡ lỗi về sau." },
    { en: "Despite the tight deadline, we delivered a stable release.", vi: "Bất chấp hạn chót gấp gáp, chúng tôi đã bàn giao bản phát hành ổn định." }
  ],
  C1: [
    { en: "Not only did she finish the project early, but she also improved its performance.", vi: "Cô ấy không chỉ hoàn thành dự án sớm mà còn cải thiện hiệu năng của nó." },
    { en: "The proposal, which had been rejected twice, was finally approved.", vi: "Đề xuất từng bị từ chối hai lần cuối cùng đã được phê duyệt." },
    { en: "Rarely have I seen such a well-organized team.", vi: "Hiếm khi tôi thấy một đội làm việc có tổ chức như vậy." },
    { en: "It is high time we reconsidered our approach to testing.", vi: "Đã đến lúc chúng ta xem xét lại cách tiếp cận việc kiểm thử." },
    { en: "Were it not for open-source tools, modern software development would be far slower.", vi: "Nếu không có các công cụ mã nguồn mở, việc phát triển phần mềm hiện đại sẽ chậm hơn rất nhiều." }
  ]
};

export const STATIC_BLANKS = {
  A1: [
    { s: "I ___ a student.", a: "am", h: "Động từ to be với I", cat: "To Be", alt: [], d: ["is", "are", "be"] },
    { s: "She ___ two brothers.", a: "has", h: "have / has với chủ ngữ số ít", cat: "Present Simple", alt: [], d: ["have", "is", "having"] },
    { s: "There ___ a book on the table.", a: "is", h: "There is + danh từ số ít", cat: "There is/are", alt: [], d: ["are", "am", "be"] },
    { s: "I go to school ___ bus.", a: "by", h: "by + phương tiện giao thông", cat: "Prepositions", alt: [], d: ["on", "in", "with"] },
    { s: "We always have breakfast ___ 7 AM.", a: "at", h: "at + giờ cụ thể", cat: "Prepositions", alt: [], d: ["on", "in", "to"] }
  ],
  A2: [
    { s: "Please turn ___ the lights when you leave.", a: "off", h: "turn off = tắt (đèn, thiết bị)", cat: "Phrasal Verbs", alt: [], d: ["on", "up", "in"] },
    { s: "It's ___ cold to go swimming today.", a: "too", h: "too + adj + to V (quá... để làm gì)", cat: "Structures", alt: [], d: ["very", "so", "enough"] },
    { s: "She is interested ___ learning Japanese.", a: "in", h: "be interested in + V-ing", cat: "Collocations", alt: [], d: ["on", "at", "for"] },
    { s: "They ___ playing football when it started to rain.", a: "were", h: "Quá khứ tiếp diễn với They", cat: "Past Continuous", alt: [], d: ["was", "are", "did"] },
    { s: "Have you ___ been to Ha Long Bay?", a: "ever", h: "Have you ever + V3/ed (Bạn đã từng...)", cat: "Present Perfect", alt: [], d: ["never", "yet", "already"] }
  ],
  B1: [
    { s: "She has lived here ___ 2020.", a: "since", h: "since + mốc thời gian bắt đầu", cat: "Present Perfect", alt: [], d: ["for", "from", "during"] },
    { s: "I'm looking forward ___ seeing you.", a: "to", h: "look forward to + V-ing", cat: "Phrasal Verbs", alt: [], d: ["for", "at", "in"] },
    { s: "He is good ___ solving problems.", a: "at", h: "be good at + V-ing", cat: "Adjective + Prep", alt: [], d: ["in", "on", "with"] },
    { s: "The project depends ___ everyone's effort.", a: "on", h: "depend on / upon", cat: "Verb + Prep", alt: ["upon"], d: ["in", "of", "at"] },
    { s: "Unless you ___ now, you will miss the flight.", a: "leave", h: "Unless + hiện tại đơn (Câu ĐK loại 1)", cat: "Conditionals", alt: ["start"], d: ["will leave", "left", "leaving"] }
  ],
  B2: [
    { s: "If I ___ you, I would accept the offer.", a: "were", h: "Câu điều kiện loại 2 (If I were you)", cat: "Conditionals", alt: [], d: ["am", "was being", "will be"] },
    { s: "This is the book ___ I told you about.", a: "which", h: "Đại từ quan hệ chỉ vật", cat: "Relative Clauses", alt: ["that"], d: ["who", "whose", "what"] },
    { s: "We need to ___ up a meeting with the client.", a: "set", h: "set up a meeting = sắp xếp cuộc họp", cat: "Phrasal Verbs", alt: [], d: ["put", "take", "make"] },
    { s: "I've already ___ my homework.", a: "finished", h: "have + already + V3/ed", cat: "Present Perfect", alt: ["done"], d: ["finish", "finishing", "did"] },
    { s: "She apologized ___ arriving late to the interview.", a: "for", h: "apologize for + V-ing", cat: "Verb + Prep", alt: [], d: ["to", "about", "with"] }
  ],
  C1: [
    { s: "Hardly ___ I arrived when the meeting started.", a: "had", h: "Đảo ngữ: Hardly + had + S + V3/ed + when...", cat: "Inversion", alt: [], d: ["did", "have", "was"] },
    { s: "The results were ___ with our expectations.", a: "consistent", h: "be consistent with = nhất quán, phù hợp với", cat: "Collocations", alt: [], d: ["constant", "persistent", "consequent"] },
    { s: "She took the criticism ___ her stride.", a: "in", h: "take something in one's stride = bình thản đón nhận", cat: "Idioms", alt: [], d: ["on", "with", "at"] },
    { s: "___ the circumstances, we did our best.", a: "given", h: "Given + Noun = Xét đến điều kiện", cat: "Connectors", alt: ["considering"], d: ["giving", "despite", "although"] },
    { s: "Little ___ he know that the code had a memory leak.", a: "did", h: "Đảo ngữ phủ định: Little + did + S + V", cat: "Inversion", alt: [], d: ["does", "had", "was"] }
  ]
};

export const STATIC_PLACEMENT_TEST = [
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

/**
 * NEW: Graded Reading Comprehension Articles (A1 -> C1)
 */
export const STATIC_READINGS = [
  {
    id: "read-a1-1",
    lv: "A1",
    topic: "Đời sống",
    title: "A Sunday Morning in the Park",
    titleVi: "Buổi sáng Chủ nhật ở công viên",
    readTime: "2 phút",
    content: "Every Sunday morning, Minh wakes up at 6:30 AM. He puts on his running shoes and walks to Tao Dan Park near his house. In the park, many people are doing exercise. Some older people practice tai chi slowly under the green trees, while young friends play badminton and laugh together. After running for thirty minutes, Minh buys a cup of iced milk coffee and a warm baguette from a small street cart. It is his favorite way to start a peaceful weekend.",
    contentVi: "Mỗi sáng Chủ nhật, Minh thức dậy lúc 6 giờ 30. Cậu mang giày chạy bộ và đi bộ đến công viên Tao Đàn gần nhà. Trong công viên, nhiều người đang tập thể dục. Một số người lớn tuổi tập dưỡng sinh chậm rãi dưới những tán cây xanh, trong khi nhóm bạn trẻ chơi cầu lông và cười nói vui vẻ. Sau khi chạy bộ ba mươi phút, Minh mua một ly cà phê sữa đá và một ổ bánh mì nóng từ xe đẩy nhỏ bên đường. Đó là cách yêu thích của cậu để bắt đầu ngày cuối tuần bình yên.",
    glossary: [
      { en: "wake up", vi: "thức dậy", ipa: "/weɪk ʌp/" },
      { en: "exercise", vi: "tập thể dục", ipa: "/ˈek.sər.saɪz/" },
      { en: "peaceful", vi: "bình yên", ipa: "/ˈpiːs.fəl/" },
      { en: "baguette", vi: "bánh mì ổ dài", ipa: "/bæˈɡet/" }
    ],
    questions: [
      {
        q: "Where does Minh go every Sunday morning?",
        options: ["To Tao Dan Park", "To the supermarket", "To his school library", "To the cinema"],
        answer: 0,
        explain: "Bài đọc nêu rõ: 'He puts on his running shoes and walks to Tao Dan Park near his house.'"
      },
      {
        q: "How long does Minh run in the park?",
        options: ["Fifteen minutes", "Thirty minutes", "One hour", "Two hours"],
        answer: 1,
        explain: "Trong bài có câu: 'After running for thirty minutes...'"
      },
      {
        q: "What does he buy after running?",
        options: ["Green tea and cake", "Iced milk coffee and a warm baguette", "Orange juice and noodles", "A bottle of water only"],
        answer: 1,
        explain: "Minh mua 'a cup of iced milk coffee and a warm baguette'."
      }
    ]
  },
  {
    id: "read-a2-1",
    lv: "A2",
    topic: "Du lịch & Ẩm thực",
    title: "Exploring Hoi An Ancient Town",
    titleVi: "Khám phá Phố cổ Hội An",
    readTime: "3 phút",
    content: "Last month, Lan and her friends traveled to Hoi An for a three-day holiday. Because motorbikes are not allowed in the center during peak hours, they rented bicycles to explore the narrow yellow streets. In the afternoon, they visited a traditional lantern workshop and learned how to cover bamboo frames with colorful silk. When evening came, hundreds of lanterns lit up along the Hoai River, creating a magical reflection on the water. Before returning to their hotel, they tasted Cao Lau noodles at a small local restaurant.",
    contentVi: "Tháng trước, Lan và nhóm bạn đã đi du lịch Hội An trong kỳ nghỉ ba ngày. Vì xe máy không được phép đi vào trung tâm trong giờ cao điểm, họ đã thuê xe đạp để khám phá những con phố nhỏ màu vàng. Buổi chiều, họ ghé thăm một xưởng làm đèn lồng truyền thống và học cách bọc lụa nhiều màu lên khung tre. Khi màn đêm buông xuống, hàng trăm chiếc đèn lồng thắp sáng dọc sông Hoài, tạo nên hình ảnh phản chiếu lung linh trên mặt nước. Trước khi về khách sạn, họ đã thưởng thức món mì Cao Lầu tại một quán nhỏ địa phương.",
    glossary: [
      { en: "ancient", vi: "cổ kính, xưa", ipa: "/ˈeɪn.ʃənt/" },
      { en: "lantern", vi: "đèn lồng", ipa: "/ˈlæn.tərn/" },
      { en: "reflection", vi: "hình ảnh phản chiếu", ipa: "/rɪˈflek.ʃən/" },
      { en: "traditional", vi: "truyền thống", ipa: "/trəˈdɪʃ.ən.əl/" }
    ],
    questions: [
      {
        q: "How did Lan and her friends move around the town center?",
        options: ["By motorbike", "By taxi", "By bicycle", "By bus"],
        answer: 2,
        explain: "Bài đọc viết: '...they rented bicycles to explore the narrow yellow streets.'"
      },
      {
        q: "What did they learn at the afternoon workshop?",
        options: ["How to cook Cao Lau noodles", "How to make silk lanterns", "How to row a boat", "How to paint yellow walls"],
        answer: 1,
        explain: "Họ đã ghé xưởng đèn lồng và học cách bọc lụa lên khung tre ('cover bamboo frames with colorful silk')."
      },
      {
        q: "When did the lanterns light up along the Hoai River?",
        options: ["Early in the morning", "At noon", "In the evening", "At midnight"],
        answer: 2,
        explain: "Trong bài viết: 'When evening came, hundreds of lanterns lit up along the Hoai River'."
      }
    ]
  },
  {
    id: "read-b1-1",
    lv: "B1",
    topic: "Học tập & Thói quen",
    title: "The Power of Micro-Learning",
    titleVi: "Sức mạnh của phương pháp Học chia nhỏ (Micro-Learning)",
    readTime: "3 phút",
    content: "Many learners believe that studying English requires three-hour marathon sessions on weekends. However, cognitive scientists have found that our brains remember information much better through spaced repetition and short daily sessions. Spending just twenty minutes every day reviewing ten words, listening to a short dialogue, and writing three sentences builds stronger neural pathways than cramming once a week. When learning feels manageable, you are far less likely to procrastinate and much more likely to maintain a long-term streak.",
    contentVi: "Nhiều người học tin rằng việc học tiếng Anh đòi hỏi những buổi học kéo dài ba tiếng đồng hồ vào cuối tuần. Tuy nhiên, các nhà khoa học nhận thức đã phát hiện ra rằng bộ não của chúng ta ghi nhớ thông tin tốt hơn nhiều thông qua việc lặp lại ngắt quãng và các buổi học ngắn mỗi ngày. Chỉ cần dành hai mươi phút mỗi ngày để ôn mười từ vựng, nghe một đoạn hội thoại ngắn và viết ba câu sẽ tạo dựng các liên kết thần kinh bền vững hơn so với việc học nhồi nhét mỗi tuần một lần. Khi việc học trở nên vừa sức, bạn sẽ ít trì hoãn hơn và dễ duy trì chuỗi ngày học lâu dài.",
    glossary: [
      { en: "spaced repetition", vi: "lặp lại ngắt quãng", ipa: "/speɪst ˌrep.əˈtɪʃ.ən/" },
      { en: "cram", vi: "học nhồi nhét", ipa: "/kræm/" },
      { en: "manageable", vi: "vừa sức, dễ quản lý", ipa: "/ˈmæn.ɪ.dʒə.bəl/" },
      { en: "procrastinate", vi: "trì hoãn", ipa: "/prəʊˈkræs.tɪ.neɪt/" }
    ],
    questions: [
      {
        q: "According to cognitive scientists, what helps the brain remember better?",
        options: ["Studying for three hours only on Sundays", "Spaced repetition and short daily sessions", "Memorizing dictionaries without context", "Skipping practice until exams"],
        answer: 1,
        explain: "Bài đọc chỉ rõ: '...our brains remember information much better through spaced repetition and short daily sessions.'"
      },
      {
        q: "What does the word 'cramming' in the passage mean?",
        options: ["Studying a large amount of material in a short time", "Taking a relaxing walk", "Speaking with native speakers", "Listening to music"],
        answer: 0,
        explain: "'Cramming' có nghĩa là học dồn, học nhồi nhét trong thời gian ngắn."
      },
      {
        q: "Why do short sessions reduce procrastination?",
        options: ["Because they require expensive books", "Because learning feels manageable", "Because grammar is ignored", "Because tests are canceled"],
        answer: 1,
        explain: "Câu cuối nêu: 'When learning feels manageable, you are far less likely to procrastinate'."
      }
    ]
  },
  {
    id: "read-b2-1",
    lv: "B2",
    topic: "Công nghệ / IT",
    title: "Why Design Systems Matter in Modern Engineering",
    titleVi: "Tại sao Design System lại quan trọng trong Kỹ thuật Phần mềm hiện đại",
    readTime: "4 phút",
    content: "As software products scale across dozens of teams, visual and behavioral inconsistencies inevitably emerge. Buttons end up with slightly different heights, modals trap keyboard focus unpredictably, and dark mode colors lose contrast. A cohesive design system like Meta's Astryx solves this by establishing a single source of truth through semantic design tokens and accessible component primitives. Instead of hardcoding hex values or pixel margins, engineers and AI coding assistants reference tokens such as '--color-accent' and '--radius-container'. Consequently, teams ship features faster while maintaining strict accessibility standards.",
    contentVi: "Khi các sản phẩm phần mềm mở rộng quy mô qua hàng chục nhóm phát triển, sự thiếu nhất quán về giao diện và hành vi tương tác là điều khó tránh khỏi. Các nút bấm có chiều cao lệch nhau, hộp thoại bắt tiêu điểm bàn phím thiếu ổn định và màu sắc chế độ tối bị giảm độ tương phản. Một hệ thống thiết kế đồng nhất như Astryx của Meta giải quyết vấn đề này bằng cách thiết lập nguồn chuẩn duy nhất thông qua các design token ngữ nghĩa và bộ thành phần chuẩn tiếp cận. Thay vì gán cứng mã màu hex hay lề pixel, kỹ sư và trợ lý AI tham chiếu tới các token như '--color-accent' và '--radius-container'. Nhờ đó, các nhóm phát triển tính năng nhanh hơn mà vẫn đảm bảo tiêu chuẩn truy cập nghiêm ngặt.",
    glossary: [
      { en: "inconsistency", vi: "sự thiếu nhất quán", ipa: "/ˌɪn.kənˈsɪs.tən.si/" },
      { en: "cohesive", vi: "gắn kết, đồng nhất", ipa: "/koʊˈhiː.sɪv/" },
      { en: "semantic", vi: "thuộc về ngữ nghĩa", ipa: "/səˈmæn.tɪk/" },
      { en: "accessibility", vi: "khả năng tiếp cận (cho mọi người dùng)", ipa: "/əkˌses.əˈbɪl.ə.ti/" }
    ],
    questions: [
      {
        q: "What problem commonly occurs when software products scale across many teams?",
        options: ["Servers stop using electricity", "Visual and behavioral inconsistencies emerge", "Users stop using mobile phones", "Programming languages stop working"],
        answer: 1,
        explain: "Câu đầu tiên nêu: 'As software products scale across dozens of teams, visual and behavioral inconsistencies inevitably emerge.'"
      },
      {
        q: "How does a design system avoid hardcoded hex values and pixel margins?",
        options: ["By removing all CSS files", "By using semantic design tokens and accessible primitives", "By outlawing dark mode", "By using only plain text"],
        answer: 1,
        explain: "Bài viết giải thích việc dùng 'semantic design tokens and accessible component primitives' thay cho giá trị gán cứng."
      },
      {
        q: "What is the main benefit of referencing shared tokens and conventions?",
        options: ["Teams ship features faster while maintaining accessibility standards", "Websites require no internet connection", "Databases become 10 times larger", "Designers never need to talk to engineers"],
        answer: 0,
        explain: "Câu kết luận: 'Consequently, teams ship features faster while maintaining strict accessibility standards.'"
      }
    ]
  },
  {
    id: "read-c1-1",
    lv: "C1",
    topic: "Khoa học & Xã hội",
    title: "Cognitive Offloading in the Age of Artificial Intelligence",
    titleVi: "Sự giảm tải nhận thức trong kỷ nguyên Trí tuệ nhân tạo",
    readTime: "4 phút",
    content: "Throughout history, human beings have relied on external artifacts—from clay tablets and printed indices to calculators and search engines—to offload memory and computation. The proliferation of generative AI represents a qualitative leap in this trajectory: rather than merely retrieving static records, modern agents synthesize arguments and draft complex prose on demand. While this cognitive offloading undoubtedly amplifies productivity, educators caution against passive reliance. True mastery still demands active retrieval and critical evaluation; when learners use AI as a Socratic sparring partner that critiques their reasoning rather than a shortcut that bypasses effort, technology elevates human intellect instead of dulling it.",
    contentVi: "Xuyên suốt lịch sử, con người luôn dựa vào các công cụ bên ngoài—từ bảng đất sét, mục lục in ấn cho đến máy tính bỏ túi và công cụ tìm kiếm—để giảm tải cho trí nhớ và việc tính toán. Sự bùng nổ của AI tạo sinh đánh dấu một bước nhảy vọt về chất trong tiến trình này: thay vì chỉ truy xuất dữ liệu tĩnh, các tác nhân hiện đại có thể tổng hợp lập luận và soạn thảo văn bản phức tạp theo yêu cầu. Mặc dù sự giảm tải nhận thức này rõ ràng giúp gia tăng năng suất, các nhà giáo dục vẫn cảnh báo về sự phụ thuộc thụ động. Sự tinh thông thực sự vẫn đòi hỏi quá trình chủ động truy xuất trí nhớ và tư duy phản biện; khi người học sử dụng AI như một người bạn đồng hành đối thoại giúp phản biện lập luận thay vì một lối tắt bỏ qua nỗ lực, công nghệ sẽ nâng tầm trí tuệ con người thay vì làm mai một nó.",
    glossary: [
      { en: "proliferation", vi: "sự bùng nổ, gia tăng nhanh", ipa: "/prəˌlɪf.əˈreɪ.ʃən/" },
      { en: "trajectory", vi: "quỹ đạo, tiến trình phát triển", ipa: "/trəˈdʒek.tər.i/" },
      { en: "amplify", vi: "khuếch đại, gia tăng", ipa: "/ˈæm.plə.faɪ/" },
      { en: "sparring partner", vi: "bạn tập đối kháng / người đối thoại rèn luyện", ipa: "/ˈspɑːr.ɪŋ ˌpɑːrt.nər/" }
    ],
    questions: [
      {
        q: "How does generative AI differ from earlier cognitive offloading tools like search engines?",
        options: [
          "It only stores numbers on clay tablets",
          "It synthesizes arguments and drafts complex prose rather than just retrieving static records",
          "It prevents users from reading text on screens",
          "It operates without any computational power"
        ],
        answer: 1,
        explain: "Bài đọc chỉ rõ: 'rather than merely retrieving static records, modern agents synthesize arguments and draft complex prose on demand.'"
      },
      {
        q: "What danger do educators warn against regarding AI usage?",
        options: ["Active retrieval practice", "Passive reliance that bypasses effort", "Socratic dialogue", "Learning foreign languages"],
        answer: 1,
        explain: "Các nhà giáo dục cảnh báo về 'passive reliance' (sự phụ thuộc thụ động bỏ qua nỗ lực tư duy)."
      },
      {
        q: "According to the author, how should learners ideally use AI?",
        options: [
          "As a Socratic sparring partner that critiques their reasoning",
          "As a tool to avoid writing anything themselves",
          "Only once a year during final exams",
          "To replace all critical evaluation"
        ],
        answer: 0,
        explain: "Câu cuối nhấn mạnh việc dùng AI 'as a Socratic sparring partner that critiques their reasoning'."
      }
    ]
  }
];

/**
 * NEW: Structured CEFR Grammar Library (A1 -> C1)
 */
export const STATIC_GRAMMAR = [
  {
    id: "gram-a1-present",
    lv: "A1",
    title: "Present Simple vs. Present Continuous",
    titleVi: "Hiện tại đơn & Hiện tại tiếp diễn",
    category: "Tenses (Thì động từ)",
    formula: "HT Đơn: S + V(s/es)  |  HT Tiếp diễn: S + am/is/are + V-ing",
    usage: "Dùng Hiện tại đơn cho thói quen lặp lại, sự thật hiển nhiên và lịch trình cố định. Dùng Hiện tại tiếp diễn cho hành động đang diễn ra ngay lúc nói hoặc kế hoạch tạm thời.",
    mistake: "Người Việt hay quên chia -s/-es ở ngôi thứ 3 số ít (He/She/It) hoặc dùng 'I am agree' thay vì 'I agree' (động từ chỉ trạng thái không chia V-ing).",
    examples: [
      { en: "She usually walks to work, but today she is taking the bus.", vi: "Cô ấy thường đi bộ đi làm, nhưng hôm nay cô ấy đang đi xe buýt." },
      { en: "Water boils at 100 degrees Celsius.", vi: "Nước sôi ở 100 độ C." },
      { en: "I understand your point completely.", vi: "Tôi hoàn toàn hiểu ý của bạn. (Không dùng: I am understanding)" }
    ],
    quiz: [
      { q: "Listen! Someone ___ the piano upstairs.", options: ["plays", "is playing", "play", "played"], answer: 1, explain: "'Listen!' là dấu hiệu hành động đang diễn ra ngay lúc nói -> is playing." },
      { q: "My brother ___ as a backend developer in District 1.", options: ["work", "working", "works", "is work"], answer: 2, explain: "Nghề nghiệp ổn định ở ngôi thứ 3 số ít (My brother) -> works." }
    ]
  },
  {
    id: "gram-a2-past-perf",
    lv: "A2",
    title: "Past Simple vs. Present Perfect",
    titleVi: "Quá khứ đơn & Hiện tại hoàn thành",
    category: "Tenses (Thì động từ)",
    formula: "QK Đơn: S + V2/ed  |  HT Hoàn thành: S + have/has + V3/ed",
    usage: "Dùng Quá khứ đơn khi có mốc thời gian xác định đã kết thúc (yesterday, in 2022, last night). Dùng Hiện tại hoàn thành cho trải nghiệm (ever/never), hành động kéo dài đến hiện tại (for/since), hoặc vừa mới xảy ra (just/already/yet).",
    mistake: "Dùng Hiện tại hoàn thành với thời gian quá khứ cụ thể (Sai: 'I have seen him yesterday' -> Đúng: 'I saw him yesterday').",
    examples: [
      { en: "I visited Da Lat three years ago.", vi: "Tôi đã đi Đà Lạt cách đây ba năm. (Mốc thời gian đã qua)" },
      { en: "I have visited Da Lat three times so far.", vi: "Tính đến nay tôi đã đi Đà Lạt ba lần. (Trải nghiệm tính đến hiện tại)" },
      { en: "We have known each other since university.", vi: "Chúng tôi đã quen nhau từ thời đại học." }
    ],
    quiz: [
      { q: "We ___ the new software update last Tuesday.", options: ["have released", "released", "release", "are releasing"], answer: 1, explain: "'last Tuesday' là mốc thời gian quá khứ xác định -> dùng Quá khứ đơn (released)." },
      { q: "She ___ three cup of coffee already this morning.", options: ["drank", "has drunk", "drinks", "was drinking"], answer: 1, explain: "'already this morning' (buổi sáng chưa kết thúc, nhấn mạnh kết quả) -> has drunk." }
    ]
  },
  {
    id: "gram-b1-conditionals",
    lv: "B1",
    title: "First & Second Conditionals",
    titleVi: "Câu điều kiện Loại 1 & Loại 2",
    category: "Conditionals (Câu điều kiện)",
    formula: "Loại 1 (Có thật): If + S + V(htđ), S + will + V  |  Loại 2 (Không có thật ở HT): If + S + V2/ed (were), S + would + V",
    usage: "Loại 1 diễn tả điều có khả năng xảy ra thật ở hiện tại hoặc tương lai. Loại 2 diễn tả giả định trái ngược với thực tế ở hiện tại hoặc lời khuyên ('If I were you...').",
    mistake: "Đặt 'will' ngay trong mệnh đề 'If' (Sai: 'If it will rain tomorrow' -> Đúng: 'If it rains tomorrow').",
    examples: [
      { en: "If you review your notebook daily, you will remember 90% of the words.", vi: "Nếu bạn ôn sổ tay mỗi ngày, bạn sẽ nhớ được 90% số từ." },
      { en: "If I had more free time, I would learn a third language.", vi: "Nếu hiện tại tôi có nhiều thời gian rảnh hơn, tôi sẽ học thêm ngoại ngữ thứ ba." }
    ],
    quiz: [
      { q: "If I ___ you, I would back up the database before migrating.", options: ["am", "was being", "were", "will be"], answer: 2, explain: "Cấu trúc khuyên nhủ ở Câu ĐK loại 2: 'If I were you, I would + V'." },
      { q: "We will miss the train unless we ___ right now.", options: ["leave", "will leave", "left", "leaving"], answer: 0, explain: "Sau 'unless' (= if... not) dùng thì Hiện tại đơn trong câu điều kiện loại 1." }
    ]
  },
  {
    id: "gram-b1-passive",
    lv: "B1",
    title: "Passive Voice in Real Communication",
    titleVi: "Câu bị động trong giao tiếp & học thuật",
    category: "Voice (Thể câu)",
    formula: "S + be (chia theo thì) + V3/ed (+ by O)",
    usage: "Dùng khi muốn nhấn mạnh đối tượng chịu tác động của hành động, hoặc khi không cần thiết/không biết ai là người thực hiện (rất phổ biến trong báo cáo kỹ thuật và IELTS Writing).",
    mistake: "Quên động từ 'to be' trước V3/ed (Sai: 'The bug fixed yesterday' -> Đúng: 'The bug was fixed yesterday').",
    examples: [
      { en: "All user passwords are encrypted before being stored.", vi: "Mọi mật khẩu người dùng đều được mã hóa trước khi lưu trữ." },
      { en: "The bridge was built over a century ago.", vi: "Cây cầu đã được xây dựng từ hơn một thế kỷ trước." }
    ],
    quiz: [
      { q: "The final decision ___ at tomorrow's board meeting.", options: ["will make", "will be made", "is making", "made"], answer: 1, explain: "Chủ ngữ 'The final decision' chịu tác động ở tương lai -> will be made." }
    ]
  },
  {
    id: "gram-b2-relative",
    lv: "B2",
    title: "Defining & Non-defining Relative Clauses",
    titleVi: "Mệnh đề quan hệ Xác định & Không xác định",
    category: "Clauses (Mệnh đề)",
    formula: "who (người) · which (vật/cả câu) · that (người/vật, không sau dấu phẩy) · whose (sở hữu) · where (nơi chốn)",
    usage: "Mệnh đề xác định giúp nhận diện danh từ đứng trước (không có dấu phẩy). Mệnh đề không xác định bổ sung thông tin phụ cho danh từ đã rõ ràng (ngăn cách bởi dấu phẩy, KHÔNG được dùng 'that').",
    mistake: "Dùng 'that' ngay sau dấu phẩy (Sai: 'Hanoi, that is the capital...' -> Đúng: 'Hanoi, which is the capital...').",
    examples: [
      { en: "Engineers who write clean documentation are highly valued.", vi: "Những kỹ sư viết tài liệu rõ ràng luôn được đánh giá cao." },
      { en: "Meta Astryx, which is built on React and StyleX, supports seven themes.", vi: "Meta Astryx, vốn được xây dựng trên React và StyleX, hỗ trợ bảy chủ đề giao diện." }
    ],
    quiz: [
      { q: "Our team delayed the launch, ___ gave us time to fix critical bugs.", options: ["that", "which", "who", "what"], answer: 1, explain: "Sau dấu phẩy, thay thế cho cả mệnh đề phía trước -> bắt buộc dùng 'which'." }
    ]
  },
  {
    id: "gram-c1-inversion",
    lv: "C1",
    title: "Negative & Conditional Inversion",
    titleVi: "Đảo ngữ nhấn mạnh & Đảo ngữ câu điều kiện",
    category: "Advanced C1 (Cấu trúc nâng cao)",
    formula: "Negative Adv (Never / Rarely / Seldom / Not only / Hardly...when) + Trợ động từ + S + V",
    usage: "Đưa trạng từ phủ định hoặc giới hạn lên đầu câu để tạo giọng văn trang trọng, nhấn mạnh mạnh mẽ trong bài viết C1/IELTS hoặc thuyết trình.",
    mistake: "Đưa trạng từ lên đầu câu nhưng quên đảo trợ động từ lên trước chủ ngữ (Sai: 'Rarely I see...' -> Đúng: 'Rarely do I see...').",
    examples: [
      { en: "Not only does this architecture reduce latency, but it also lowers server costs.", vi: "Kiến trúc này không chỉ giảm độ trễ mà còn hạ chi phí máy chủ." },
      { en: "Had we anticipated the traffic spike, we would have scaled the cluster earlier.", vi: "Giá như chúng tôi lường trước lượng truy cập tăng vọt, chúng tôi đã mở rộng cụm máy chủ sớm hơn." }
    ],
    quiz: [
      { q: "No sooner ___ the deployment finished than the monitoring alert triggered.", options: ["did", "had", "was", "has"], answer: 1, explain: "Cấu trúc chuẩn C1: 'No sooner + had + S + V3/ed + than + S + V2/ed'." }
    ]
  }
];

/**
 * NEW: 40 Essential Irregular Verbs (V1 - V2 - V3)
 */
export const STATIC_IRREGULAR_VERBS = [
  { v1: "be", v2: "was / were", v3: "been", ipa: "/biː/", vi: "thì, là, ở", lv: "A1", ex: "She has been to London twice." },
  { v1: "become", v2: "became", v3: "become", ipa: "/bɪˈkʌm/", vi: "trở nên, trở thành", lv: "A2", ex: "He became a senior engineer at 26." },
  { v1: "begin", v2: "began", v3: "begun", ipa: "/bɪˈɡɪn/", vi: "bắt đầu", lv: "A1", ex: "The conference has already begun." },
  { v1: "break", v2: "broke", v3: "broken", ipa: "/breɪk/", vi: "làm vỡ, làm hỏng", lv: "A2", ex: "The latest commit broke the build." },
  { v1: "bring", v2: "brought", v3: "brought", ipa: "/brɪŋ/", vi: "mang đến", lv: "A2", ex: "She brought homemade cookies to the office." },
  { v1: "build", v2: "built", v3: "built", ipa: "/bɪld/", vi: "xây dựng", lv: "A2", ex: "They built a scalable design system." },
  { v1: "buy", v2: "bought", v3: "bought", ipa: "/baɪ/", vi: "mua", lv: "A1", ex: "I bought a new mechanical keyboard yesterday." },
  { v1: "catch", v2: "caught", v3: "caught", ipa: "/kætʃ/", vi: "bắt kịp, đón (xe)", lv: "A2", ex: "We caught the early train to Sapa." },
  { v1: "choose", v2: "chose", v3: "chosen", ipa: "/tʃuːz/", vi: "lựa chọn", lv: "A2", ex: "Have you chosen a theme for your app?" },
  { v1: "come", v2: "came", v3: "come", ipa: "/kʌm/", vi: "đến", lv: "A1", ex: "They came to Vietnam last summer." },
  { v1: "do", v2: "did", v3: "done", ipa: "/duː/", vi: "làm, thực hiện", lv: "A1", ex: "Well done! You completed all exercises." },
  { v1: "drink", v2: "drank", v3: "drunk", ipa: "/drɪŋk/", vi: "uống", lv: "A1", ex: "He drank a cup of hot matcha tea." },
  { v1: "drive", v2: "drove", v3: "driven", ipa: "/draɪv/", vi: "lái xe, thúc đẩy", lv: "A2", ex: "Our decisions are driven by real user data." },
  { v1: "eat", v2: "ate", v3: "eaten", ipa: "/iːt/", vi: "ăn", lv: "A1", ex: "Have you eaten lunch yet?" },
  { v1: "fall", v2: "fell", v3: "fallen", ipa: "/fɔːl/", vi: "rơi, giảm xuống", lv: "A2", ex: "Error rates have fallen by 40 percent." },
  { v1: "feel", v2: "felt", v3: "felt", ipa: "/fiːl/", vi: "cảm thấy", lv: "A1", ex: "I felt much more confident after practicing." },
  { v1: "find", v2: "found", v3: "found", ipa: "/faɪnd/", vi: "tìm thấy, nhận thấy", lv: "A1", ex: "We found the root cause of the bug." },
  { v1: "fly", v2: "flew", v3: "flown", ipa: "/flaɪ/", vi: "bay", lv: "A2", ex: "She has flown over 50,000 miles this year." },
  { v1: "forget", v2: "forgot", v3: "forgotten", ipa: "/fərˈɡet/", vi: "quên", lv: "A2", ex: "I have never forgotten her kindness." },
  { v1: "get", v2: "got", v3: "gotten / got", ipa: "/ɡet/", vi: "nhận được, trở nên", lv: "A1", ex: "His pronunciation has gotten much clearer." },
  { v1: "give", v2: "gave", v3: "given", ipa: "/ɡɪv/", vi: "đưa, tặng, cung cấp", lv: "A1", ex: "The mentor gave me constructive feedback." },
  { v1: "go", v2: "went", v3: "gone", ipa: "/ɡoʊ/", vi: "đi", lv: "A1", ex: "They have gone to the meeting room." },
  { v1: "grow", v2: "grew", v3: "grown", ipa: "/ɡroʊ/", vi: "phát triển, lớn lên", lv: "A2", ex: "Astryx grew inside Meta over eight years." },
  { v1: "have", v2: "had", v3: "had", ipa: "/hæv/", vi: "có", lv: "A1", ex: "We had a productive sprint review." },
  { v1: "hear", v2: "heard", v3: "heard", ipa: "/hɪr/", vi: "nghe thấy", lv: "A2", ex: "Have you heard the news about the release?" },
  { v1: "keep", v2: "kept", v3: "kept", ipa: "/kiːp/", vi: "giữ, duy trì", lv: "A2", ex: "She kept her learning streak for 30 days." },
  { v1: "know", v2: "knew", v3: "known", ipa: "/noʊ/", vi: "biết", lv: "A1", ex: "I have known him since high school." },
  { v1: "leave", v2: "left", v3: "left", ipa: "/liːv/", vi: "rời đi, để lại", lv: "A2", ex: "He left a helpful comment on the pull request." },
  { v1: "lose", v2: "lost", v3: "lost", ipa: "/luːz/", vi: "mất, thua", lv: "A2", ex: "Never lose sight of your long-term goal." },
  { v1: "make", v2: "made", v3: "made", ipa: "/meɪk/", vi: "làm, chế tạo, tạo ra", lv: "A1", ex: "Small daily improvements made a big difference." },
  { v1: "meet", v2: "met", v3: "met", ipa: "/miːt/", vi: "gặp gỡ, đáp ứng", lv: "A1", ex: "All accessibility requirements were met." },
  { v1: "pay", v2: "paid", v3: "paid", ipa: "/peɪ/", vi: "trả tiền, chú ý", lv: "A2", ex: "Hard work always pays off in the end." },
  { v1: "put", v2: "put", v3: "put", ipa: "/pʊt/", vi: "đặt, để", lv: "A1", ex: "She put a lot of effort into her presentation." },
  { v1: "read", v2: "read", v3: "read", ipa: "/riːd/", vi: "đọc (V2/V3 phát âm là /red/)", lv: "A1", ex: "I have read the documentation thoroughly." },
  { v1: "run", v2: "ran", v3: "run", ipa: "/rʌn/", vi: "chạy, vận hành", lv: "A1", ex: "We ran the automated test suite last night." },
  { v1: "say", v2: "said", v3: "said", ipa: "/seɪ/", vi: "nói", lv: "A1", ex: "He said he would join the call at 10 AM." },
  { v1: "see", v2: "saw", v3: "seen", ipa: "/siː/", vi: "nhìn thấy, hiểu", lv: "A1", ex: "Rarely have I seen such clean code." },
  { v1: "send", v2: "sent", v3: "sent", ipa: "/send/", vi: "gửi", lv: "A2", ex: "The summary report was sent to all stakeholders." },
  { v1: "speak", v2: "spoke", v3: "spoken", ipa: "/spiːk/", vi: "nói, phát biểu", lv: "A1", ex: "English is spoken all over the world." },
  { v1: "spend", v2: "spent", v3: "spent", ipa: "/spend/", vi: "dành (thời gian), tiêu (tiền)", lv: "A2", ex: "We spent two weeks refining the user interface." },
  { v1: "take", v2: "took", v3: "taken", ipa: "/teɪk/", vi: "lấy, mang, tốn (thời gian)", lv: "A1", ex: "Your feedback has been taken into account." },
  { v1: "teach", v2: "taught", v3: "taught", ipa: "/tiːtʃ/", vi: "dạy", lv: "A2", ex: "Experience taught us to always write unit tests." },
  { v1: "think", v2: "thought", v3: "thought", ipa: "/θɪŋk/", vi: "suy nghĩ", lv: "A1", ex: "I thought the exam would be much harder." },
  { v1: "understand", v2: "understood", v3: "understood", ipa: "/ˌʌn.dərˈstænd/", vi: "hiểu", lv: "A2", ex: "Make sure the requirements are clearly understood." },
  { v1: "write", v2: "wrote", v3: "written", ipa: "/raɪt/", vi: "viết", lv: "A1", ex: "This component library was written in TypeScript." }
];

/**
 * NEW: Speaking & Pronunciation Drills (A1 -> C1)
 */
export const STATIC_SPEAKING = {
  A1: [
    { id: "sp-a1-1", en: "Good morning! Could I have a cup of hot coffee, please?", vi: "Chào buổi sáng! Cho tôi một ly cà phê nóng được không ạ?", ipa: "/ɡʊd ˈmɔːr.nɪŋ | kʊd aɪ hæv ə kʌp əv hɑːt ˈkɔː.fi pliːz/", tip: "Chú ý nối âm 'cup of' (/kʌp‿əv/) và lên giọng nhẹ ở từ 'please?' cuối câu." },
    { id: "sp-a1-2", en: "My family lives in a quiet neighborhood near the river.", vi: "Gia đình tôi sống ở một khu phố yên tĩnh gần bờ sông.", ipa: "/maɪ ˈfæm.əl.i lɪvz ɪn ə ˈkwaɪ.ət ˈneɪ.bər.hʊd nɪr ðə ˈrɪv.ər/", tip: "Phát âm rõ âm đuôi /z/ trong 'lives' (/lɪvz/) và âm /kw/ trong 'quiet'." },
    { id: "sp-a1-3", en: "What time does the supermarket close on Sundays?", vi: "Siêu thị đóng cửa lúc mấy giờ vào Chủ nhật?", ipa: "/wʌt taɪm dʌz ðə ˈsuː.pərˌmɑːr.kɪt kloʊz ɑːn ˈsʌn.deɪz/", tip: "Nhấn trọng âm vào từ khóa: 'time', 'supermarket', 'close', 'Sundays'." }
  ],
  A2: [
    { id: "sp-a2-1", en: "I usually go jogging in the park before starting work.", vi: "Tôi thường chạy bộ trong công viên trước khi bắt đầu làm việc.", ipa: "/aɪ ˈjuː.ʒu.ə.li ɡoʊ ˈdʒɑː.ɡɪŋ ɪn ðə pɑːrk bɪˈfɔːr ˈstɑːr.tɪŋ wɜːrk/", tip: "Chú ý âm /ʒ/ mềm trong từ 'usually' (/ˈjuː.ʒu.ə.li/)." },
    { id: "sp-a2-2", en: "Could you show me how to get to the nearest train station?", vi: "Bạn có thể chỉ cho tôi đường ra ga tàu gần nhất không?", ipa: "/kʊd ju ʃoʊ mi haʊ tə ɡet tə ðə ˈnɪr.ɪst treɪn ˈsteɪ.ʃən/", tip: "Giảm âm 'to' thành /tə/ để câu nói trôi chảy tự nhiên như người bản xứ." },
    { id: "sp-a2-3", en: "We had a wonderful trip despite the rainy weather.", vi: "Chúng tôi đã có một chuyến đi tuyệt vời bất chấp thời tiết mưa.", ipa: "/wi hæd ə ˈwʌn.dər.fəl trɪp dɪˈspaɪt ðə ˈreɪ.ni ˈweð.ər/", tip: "Cẩn thận âm /ð/ (đặt đầu lưỡi giữa hai hàm răng) trong 'the' và 'weather'." }
  ],
  B1: [
    { id: "sp-b1-1", en: "I have been working as a software engineer for two years.", vi: "Tôi đã làm kỹ sư phần mềm được hai năm.", ipa: "/aɪ həv bɪn ˈwɜːr.kɪŋ æz ə ˈsɔːft.wer ˌen.dʒɪˈnɪr fər tuː jɪrz/", tip: "Trọng âm của 'engineer' rơi vào âm tiết thứ 3 (/ˌen.dʒɪˈnɪr/)." },
    { id: "sp-b1-2", en: "Consistent daily practice is the secret to fluent communication.", vi: "Luyện tập đều đặn mỗi ngày là bí quyết để giao tiếp trôi chảy.", ipa: "/kənˈsɪs.tənt ˈdeɪ.li ˈpræk.tɪs ɪz ðə ˈsiː.krət tə ˈfluː.ənt kəˌmjuː.nəˈkeɪ.ʃən/", tip: "Đừng quên âm /s/ và /t/ ở cuối 'consistent' và 'practice'." },
    { id: "sp-b1-3", en: "Let's schedule a quick call tomorrow to review the design.", vi: "Hãy lên lịch một cuộc gọi nhanh vào ngày mai để duyệt thiết kế nhé.", ipa: "/lets ˈskedʒ.uːl ə kwɪk kɔːl təˈmɑːr.oʊ tə rɪˈvjuː ðə dɪˈzaɪn/", tip: "'schedule' phát âm là /ˈskedʒ.uːl/ (Anh-Mỹ), nhấn âm đầu." }
  ],
  B2: [
    { id: "sp-b2-1", en: "Although the deadline was tight, our team delivered a reliable solution.", vi: "Mặc dù hạn chót rất gấp, nhóm chúng tôi vẫn bàn giao một giải pháp đáng tin cậy.", ipa: "/ɔːlˈðoʊ ðə ˈded.laɪn wəz taɪt | ˈaʊ.ər tiːm dɪˈlɪv.ərd ə rɪˈlaɪ.ə.bəl səˈluː.ʃən/", tip: "Nghỉ nhịp ngắn ở dấu phẩy sau 'tight' và nhấn mạnh vào 'reliable solution'." },
    { id: "sp-b2-2", en: "We should prioritize user experience over unnecessary visual complexity.", vi: "Chúng ta nên ưu tiên trải nghiệm người dùng hơn là sự phức tạp hình ảnh không cần thiết.", ipa: "/wi ʃʊd praɪˈɔːr.ə.taɪz ˈjuː.zər ɪkˈspɪr.i.əns ˈoʊ.vər ʌnˈnes.ə.ser.i ˈvɪʒ.u.əl kəmˈplek.sə.ti/", tip: "Chú ý trọng âm từ 'prioritize' (/praɪˈɔːr.ə.taɪz/) và 'complexity' (/kəmˈplek.sə.ti/)." }
  ],
  C1: [
    { id: "sp-c1-1", en: "Not only does a design system accelerate development, but it also ensures accessibility.", vi: "Hệ thống thiết kế không chỉ tăng tốc phát triển mà còn đảm bảo khả năng tiếp cận.", ipa: "/nɑːt ˈoʊn.li dʌz ə dɪˈzaɪn ˈsɪs.təm ækˈsel.ə.reɪt dɪˈvel.əp.mənt | bʌt ɪt ˈɔːl.soʊ ɪnˈʃʊrz əkˌses.əˈbɪl.ə.ti/", tip: "Nhấn giọng vào 'Not only' và 'also' để làm nổi bật cấu trúc đảo ngữ C1." },
    { id: "sp-c1-2", en: "Had we scrutinized the data more meticulously, the discrepancy would have been obvious.", vi: "Giá như chúng ta xem xét dữ liệu tỉ mỉ hơn, sự chênh lệch hẳn đã rất rõ ràng.", ipa: "/hæd wi ˈskruː.tən.aɪzd ðə ˈdeɪ.tə mɔːr məˈtɪk.jə.ləs.li | ðə dɪˈskrep.ən.si wʊd həv bɪn ˈɑːb.vi.əs/", tip: "Đọc lướt cụm 'would have been' thành /wʊd.əv.bɪn/ để giữ nhịp điệu tự nhiên." }
  ]
};

/**
 * NEW: Structured AI Roleplay Scenarios with Clear Missions
 */
export const CONVERSATION_SCENARIOS = [
  {
    id: "daily",
    topic: "Daily life",
    title: "Trò chuyện đời sống hàng ngày",
    role: "Friendly Neighbor / Friend",
    goal: "Chia sẻ về kế hoạch trong ngày, thói quen buổi sáng và sở thích cuối tuần.",
    phrases: ["I usually start my day by...", "In my free time, I enjoy...", "What about you?"]
  },
  {
    id: "it-interview",
    topic: "Job interview (IT)",
    title: "Phỏng vấn Kỹ sư Phần mềm / IT",
    role: "Tech Hiring Manager",
    goal: "Giới thiệu bản thân, trình bày một dự án đã làm và cách xử lý lỗi kỹ thuật.",
    phrases: ["I have experience working with...", "One challenge I faced was...", "To solve this, I implemented..."]
  },
  {
    id: "cafe-order",
    topic: "Ordering food",
    title: "Gọi đồ uống & món ăn tại quán",
    role: "Barista / Waiter",
    goal: "Gọi món, hỏi về thành phần (ít đá/ít đường) và yêu cầu thanh toán.",
    phrases: ["Could I get a..., please?", "Can I have it with less sugar?", "Could we have the bill, please?"]
  },
  {
    id: "airport-travel",
    topic: "Travel",
    title: "Làm thủ tục Sân bay & Khách sạn",
    role: "Airport / Hotel Receptionist",
    goal: "Làm thủ tục check-in, chọn ghế ngồi cạnh cửa sổ và hỏi giờ ăn sáng.",
    phrases: ["I'd like to check in for my flight to...", "Could I have a window seat?", "What time is breakfast served?"]
  },
  {
    id: "standup-meeting",
    topic: "Team meeting at work",
    title: "Họp Daily Standup & Thảo luận dự án",
    role: "Product Manager / Tech Lead",
    goal: "Báo cáo tiến độ hôm qua, kế hoạch hôm nay và nêu 1 vướng mắc cần hỗ trợ.",
    phrases: ["Yesterday, I completed...", "Today, my main focus is...", "I'm currently blocked by..."]
  },
  {
    id: "shopping-return",
    topic: "Shopping",
    title: "Mua sắm & Đổi trả sản phẩm",
    role: "Store Associate",
    goal: "Hỏi size/màu sắc, hỏi chính sách bảo hành hoặc đổi sản phẩm bị lỗi.",
    phrases: ["Do you have this in a medium size?", "Is there a warranty on this item?", "I'd like to exchange this because..."]
  }
];

/**
 * NEW: Achievements & Badges Definition
 */
export const ACHIEVEMENTS = [
  { id: "first_xp", title: "Khởi đầu vững chắc", desc: "Đạt những điểm XP đầu tiên", check: (stats) => (stats.total || 0) >= 5 },
  { id: "daily_goal", title: "Hoàn thành mục tiêu ngày", desc: "Đạt 100% mục tiêu XP trong ngày", check: (stats, settings) => (stats.todayPoints || 0) >= (settings.dailyGoal || 50) },
  { id: "streak_3", title: "Bền bỉ 3 ngày", desc: "Duy trì chuỗi học liên tiếp 3 ngày", check: (stats) => (stats.streak || 0) >= 3 },
  { id: "xp_100", title: "Chinh phục 100 XP", desc: "Tích lũy tổng cộng từ 100 XP trở lên", check: (stats) => (stats.total || 0) >= 100 },
  { id: "xp_500", title: "Học viên xuất sắc (500 XP)", desc: "Tích lũy tổng cộng từ 500 XP trở lên", check: (stats) => (stats.total || 0) >= 500 },
  { id: "polyglot_modes", title: "Đa kỹ năng toàn diện", desc: "Luyện tập ít nhất 4 chế độ học khác nhau", check: (_, __, modeStats) => Object.keys(modeStats || {}).filter(k => (modeStats[k]?.t || 0) > 0).length >= 4 }
];
