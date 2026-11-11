import { Question } from '../types';

export const QUESTIONS_PART_1: Question[] = [
  // ============================================================================
  // CHỦ ĐỀ 1: ĐỌC HIỂU VĂN BẢN (Q001 - Q011)
  // ============================================================================
  {
    id: 'Q001',
    topic: 'Đọc hiểu văn bản',
    difficulty: 'Dễ',
    passage:
      '“Tiếng Việt của chúng ta rất giàu và rất đẹp. Giàu bởi kinh nghiệm đấu tranh của nhân dân ta lâu đời và phong phú. Đẹp bởi tâm hồn của người Việt Nam ta rất đẹp. Hai nguồn của cái giàu và cái đẹp ấy là ở chỗ tiếng Việt là tiếng nói của quần chúng nhân dân, đầy tình cảm và hình ảnh, giàu màu sắc và âm điệu, hồn nhiên, ngây thơ mà lại rất sâu sắc.”',
    passageSource: 'Phạm Văn Đồng, Giữ gìn sự trong sáng của tiếng Việt',
    content: 'Theo đoạn trích, hai phẩm chất nổi bật nhất của tiếng Việt được tác giả khẳng định trực tiếp ở câu mở đầu là gì?',
    options: [
      'Rất cổ kính và rất bác học',
      'Rất giàu và rất đẹp',
      'Rất ngắn gọn và rất linh hoạt',
      'Rất chuẩn mực và rất hiện đại',
    ],
    correctAnswer: 1,
    explanation:
      'Ngay câu đầu tiên của đoạn trích, tác giả Phạm Văn Đồng đã nêu luận điểm khái quát: “Tiếng Việt của chúng ta rất giàu và rất đẹp”.',
    relatedKnowledge: 'Kỹ năng xác định thông tin tường minh và câu chủ đề trong đoạn văn nghị luận.',
    memoryTip: 'Đọc kỹ câu mở đoạn (câu chủ đề diễn dịch) để tìm từ khóa cốt lõi.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q002',
    topic: 'Đọc hiểu văn bản',
    difficulty: 'Trung bình',
    passage:
      '“Cái quý giá nhất trên đời mà mỗi người có thể góp phần mang lại cho chính mình và cho người khác đó là năng lực tạo ra hạnh phúc, bao gồm năng lực làm người, năng lực làm việc và năng lực làm dân. Năng lực làm người là có cái đầu phân biệt được thiện - ác, chân - giả, chính - tà, đúng - sai...”',
    passageSource: 'Giản Tư Trung, Đúng việc – Một góc nhìn về câu chuyện khai minh',
    content: 'Theo tác giả, “năng lực tạo ra hạnh phúc” được cấu thành từ những thành tố nào?',
    options: [
      'Năng lực tư duy, năng lực sáng tạo và năng lực lãnh đạo',
      'Năng lực làm người, năng lực làm việc và năng lực làm dân',
      'Năng lực học tập suốt đời, năng lực hội nhập và năng lực tự chủ',
      'Năng lực cảm thụ cái đẹp, năng lực thấu cảm và năng lực sẻ chia',
    ],
    correctAnswer: 1,
    explanation:
      'Trong ngữ liệu, tác giả xác định rõ: “năng lực tạo ra hạnh phúc, bao gồm năng lực làm người, năng lực làm việc và năng lực làm dân”.',
    relatedKnowledge: 'Xác định thao tác giải thích và phân loại khái niệm trong văn bản nghị luận xã hội.',
    memoryTip: 'Chú ý cụm từ đánh dấu liệt kê “bao gồm...” ngay sau thuật ngữ trung tâm.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q003',
    topic: 'Đọc hiểu văn bản',
    difficulty: 'Dễ',
    passage:
      '“Gió đưa cây cải về trời,\nRau răm ở lại chịu lời đắng cay.”',
    passageSource: 'Ca dao Việt Nam',
    content: 'Thể thơ của câu ca dao trên là thể thơ nào?',
    options: [
      'Thơ song thất lục bát',
      'Thơ lục bát',
      'Thơ thất ngôn tứ tuyệt',
      'Thơ năm chữ',
    ],
    correctAnswer: 1,
    explanation:
      'Câu ca dao gồm một dòng 6 chữ và một dòng 8 chữ, hiệp vần ở chữ thứ 6 câu lục (“trời”) và chữ thứ 6 câu bát (“lời”), đúng quy luật thể thơ lục bát truyền thống.',
    relatedKnowledge: 'Đặc trưng thể loại thơ lục bát trong văn học dân gian Việt Nam.',
    memoryTip: 'Đếm số chữ 6 - 8 và kiểm tra vần lưng ở chữ thứ 6 của câu 8.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q004',
    topic: 'Đọc hiểu văn bản',
    difficulty: 'Trung bình',
    passage:
      '“Trí tuệ nhân tạo có thể tổng hợp hàng triệu văn bản trong vài giây, nhưng nó không biết run lên trước một chiếc lá rơi chiều thu, cũng không từng trải qua nỗi đau mất mát để viết nên một câu thơ chạm tới đáy sâu tâm thức con người.”',
    passageSource: 'Ngữ liệu biên soạn – Góc nhìn Văn học & Công nghệ',
    content: 'Nội dung chính của đoạn văn trên nhấn mạnh điều gì?',
    options: [
      'Tốc độ xử lý dữ liệu vượt trội của trí tuệ nhân tạo so với con người',
      'Giới hạn của máy móc trước trải nghiệm sống và rung động cảm xúc chân thực của con người',
      'Nguy cơ trí tuệ nhân tạo thay thế hoàn toàn nhà văn trong tương lai gần',
      'Phương pháp lập trình để máy tính có thể sáng tác thơ mùa thu',
    ],
    correctAnswer: 1,
    explanation:
      'Đoạn văn đặt sự đối lập giữa khả năng xử lý dữ liệu của AI và khả năng rung động, trải nghiệm nỗi đau của con người, qua đó khẳng định giá trị độc bản của cảm xúc nhân văn trong sáng tạo nghệ thuật.',
    relatedKnowledge: 'Xác định luận điểm chính trong đoạn văn có cấu trúc tương phản (“nhưng...”).',
    memoryTip: 'Trong câu ghép có quan hệ từ “nhưng”, trọng tâm thông điệp thường nằm ở vế sau.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q005',
    topic: 'Đọc hiểu văn bản',
    difficulty: 'Trung bình',
    passage:
      '“Làng ở trong tầm đại bác của đồn giặc. Chúng nó bắn, đã thành lệ, mỗi ngày hai lần, hoặc buổi sáng sớm và xế chiều, hoặc đứng bóng và sẩm tối, hoặc nửa đêm và trở gà gáy. Hầu hết đạn đại bác đều rơi vào ngọn đồi xà nu cạnh con nước lớn.”',
    passageSource: 'Nguyễn Trung Thành, Rừng xà nu',
    content: 'Phương thức biểu đạt chính của đoạn văn trên là gì?',
    options: [
      'Nghị luận',
      'Tự sự kết hợp miêu tả',
      'Biểu cảm trực tiếp',
      'Thuyết minh khoa học',
    ],
    correctAnswer: 1,
    explanation:
      'Đoạn trích kể lại quy luật bắn phá của giặc và tái hiện bối cảnh không gian làng Xô Man cạnh đồi xà nu, thuộc phương thức tự sự kết hợp miêu tả.',
    relatedKnowledge: 'Nhận diện các phương thức biểu đạt trong tác phẩm truyện hiện đại.',
    memoryTip: 'Có sự việc, diễn biến không gian - thời gian trong truyện ngắn -> Tự sự kết hợp miêu tả.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q006',
    topic: 'Đọc hiểu văn bản',
    difficulty: 'Khó',
    passage:
      '“Đọc sách không cốt lấy nhiều, quan trọng nhất là phải chọn cho tinh, đọc cho kỹ. Nếu đọc được mười quyển sách không quan trọng, không bằng đem thời gian, sức lực đọc mười quyển ấy mà đọc một quyển thực sự có giá trị Bộ sách có giá trị đọc đi đọc lại sẽ giúp ta xây dựng được nền tảng tư duy vững chắc.”',
    passageSource: 'Chu Quang Tiềm, Bàn về đọc sách',
    content: 'Mối quan hệ lập luận giữa câu thứ nhất và câu thứ hai trong đoạn trích là gì?',
    options: [
      'Câu đầu nêu nguyên nhân, câu sau nêu kết quả tất yếu',
      'Câu đầu nêu luận điểm khái quát, câu sau cụ thể hóa bằng phép so sánh tương phản',
      'Câu đầu nêu giả thuyết khoa học, câu sau bác bỏ giả thuyết đó',
      'Câu đầu miêu tả hiện tượng, câu sau kể lại một câu chuyện lịch sử',
    ],
    correctAnswer: 1,
    explanation:
      'Câu 1 khẳng định nguyên tắc “chọn cho tinh, đọc cho kỹ”. Câu 2 đặt phép so sánh giữa việc đọc 10 quyển không quan trọng với đọc kỹ 1 quyển giá trị để làm sáng tỏ nguyên tắc ở câu 1.',
    relatedKnowledge: 'Cấu trúc lập luận và liên kết nội dung giữa các câu trong đoạn văn nghị luận.',
    memoryTip: 'Phân tích vai trò của từng câu: Câu chủ đề -> Câu giải thích/so sánh làm rõ.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q007',
    topic: 'Đọc hiểu văn bản',
    difficulty: 'Dễ',
    passage:
      '“Sông Mã xa rồi Tây Tiến ơi!\nNhớ về rừng núi, nhớ chơi vơi\nSài Khao sương lấp đoàn quân mỏi\nMường Lát hoa về trong đêm hơi”',
    passageSource: 'Quang Dũng, Tây Tiến',
    content: 'Cảm hứng chủ đạo bao trùm bốn câu thơ mở đầu bài “Tây Tiến” là gì?',
    options: [
      'Nỗi nhớ da diết, mênh mang về thiên nhiên miền Tây và đoàn quân Tây Tiến',
      'Niềm vui sướng rộn ràng trong ngày hội chiến thắng trở về xuôi',
      'Sự phẫn nộ gay gắt trước tội ác của kẻ thù xâm lược',
      'Nỗi tuyệt vọng cô đơn của người lính khi lạc giữa rừng sâu',
    ],
    correctAnswer: 0,
    explanation:
      'Điệp từ “nhớ” cùng cụm từ giàu sức gợi “nhớ chơi vơi” và tiếng gọi “Tây Tiến ơi!” thể hiện nỗi nhớ da diết, sâu lắng về núi rừng Tây Bắc và đồng đội.',
    relatedKnowledge: 'Cảm hứng lãng mạn và nỗi nhớ trong thơ kháng chiến chống Pháp.',
    memoryTip: 'Chú ý từ khóa cảm xúc trực tiếp “Nhớ về rừng núi, nhớ chơi vơi”.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q008',
    topic: 'Đọc hiểu văn bản',
    difficulty: 'Trung bình',
    passage:
      '“Bản sắc văn hóa không phải là một khối hóa thạch bất biến nằm trong viện bảo tàng. Nó giống như dòng sông vừa giữ nguyên mạch nguồn từ thượng lưu, vừa không ngừng tiếp nhận phù sa và lọc bỏ tạp chất trên suốt hành trình vươn ra biển lớn.”',
    passageSource: 'Ngữ liệu biên soạn – Văn hóa & Hội nhập',
    content: 'Hình ảnh “mạch nguồn từ thượng lưu” trong đoạn trích biểu trưng cho điều gì?',
    options: [
      'Những trào lưu giải trí ngoại nhập đang thịnh hành',
      'Những giá trị truyền thống cốt lõi, cội nguồn của dân tộc',
      'Những quy định hành chính trong quản lý di sản',
      'Những công nghệ số hiện đại trong truyền thông quốc tế',
    ],
    correctAnswer: 1,
    explanation:
      'Trong ẩn dụ “dòng sông văn hóa”, “mạch nguồn từ thượng lưu” chỉ những giá trị truyền thống, cội nguồn bền vững của dân tộc được giữ gìn qua thời gian.',
    relatedKnowledge: 'Giải mã hình ảnh ẩn dụ trong văn bản nghị luận văn hóa.',
    memoryTip: 'Đối chiếu tương quan: Thượng lưu/Mạch nguồn = Cội nguồn truyền thống; Vươn ra biển lớn = Hội nhập.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q009',
    topic: 'Đọc hiểu văn bản',
    difficulty: 'Khó',
    passage:
      '“Người viết văn chân chính không đứng ngoài cuộc đời để phán xét như một quan tòa lạnh lùng, mà phải bước vào giữa giông bão của kiếp người, lắng nghe cả những tiếng thở dài thầm lặng nhất.”',
    passageSource: 'Ngữ liệu biên soạn – Lý luận văn học',
    content: 'Quan niệm về nhà văn được thể hiện trong đoạn trích gần gũi nhất với tư tưởng nào sau đây?',
    options: [
      'Nghệ thuật vị nghệ thuật – văn chương tách biệt hoàn toàn khỏi đời sống xã hội',
      'Nhà văn phải có sự nhập cuộc, đồng cảm và gắn bó máu thịt với số phận con người',
      'Nhà văn chỉ cần ghi chép nguyên xi các sự kiện thời sự như một chiếc máy ảnh',
      'Văn chương chỉ nên ca ngợi những vẻ đẹp siêu nhiên thoát tục',
    ],
    correctAnswer: 1,
    explanation:
      'Cụm từ “bước vào giữa giông bão của kiếp người, lắng nghe cả những tiếng thở dài thầm lặng nhất” khẳng định trách nhiệm nhập cuộc và tấm lòng nhân đạo, thấu cảm của nhà văn với cuộc đời.',
    relatedKnowledge: 'Thiên chức của nhà văn và mối quan hệ giữa văn học với hiện thực đời sống.',
    memoryTip: '“Bước vào giữa giông bão của kiếp người” = Nhập cuộc + Nhân đạo.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q010',
    topic: 'Đọc hiểu văn bản',
    difficulty: 'Trung bình',
    passage:
      '“Theo báo cáo của UNESCO, việc duy trì thói quen đọc văn bản dài ít nhất 30 phút mỗi ngày giúp thanh thiếu niên tăng 34% khả năng tập trung sâu và cải thiện đáng kể năng lực lập luận phản biện so với nhóm chỉ tiếp nhận thông tin qua các đoạn video ngắn dưới 60 giây.”',
    passageSource: 'Báo cáo nghiên cứu giáo dục & Đọc hiểu số',
    content: 'Việc tác giả đưa số liệu “30 phút mỗi ngày”, “tăng 34%”, “dưới 60 giây” vào đoạn văn nhằm mục đích gì?',
    options: [
      'Tạo nhịp điệu trữ tình và giàu nhạc tính cho đoạn văn',
      'Tăng tính khách quan, xác thực và sức thuyết phục cho thông tin khoa học',
      'Thể hiện thái độ châm biếm đối với công nghệ số hiện đại',
      'Xây dựng cốt truyện kịch tính cho tác phẩm hư cấu',
    ],
    correctAnswer: 1,
    explanation:
      'Trong văn bản thông tin/nghị luận, số liệu thống kê cụ thể từ nguồn uy tín (UNESCO) giúp thông tin trở nên khách quan, minh bạch và giàu sức thuyết phục.',
    relatedKnowledge: 'Vai trò của số liệu và dẫn chứng định lượng trong văn bản thông tin.',
    memoryTip: 'Số liệu định lượng trong văn bản thông tin luôn hướng tới tính khách quan và độ tin cậy.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q011',
    topic: 'Đọc hiểu văn bản',
    difficulty: 'Vận dụng cao',
    passage:
      '“Có những sự im lặng nặng nề hơn cả tiếng sấm, và có những lời xin lỗi được nói ra chỉ để người nói tự giải thoát cho sự áy náy của mình chứ không hề chạm tới vết thương của người nghe.”',
    passageSource: 'Ngữ liệu biên soạn – Chiêm nghiệm tâm lý & Ngôn từ',
    content: 'Thông điệp sâu sắc nhất rút ra từ vế thứ hai của câu văn trên là gì?',
    options: [
      'Con người không bao giờ nên nói lời xin lỗi trong giao tiếp hằng ngày',
      'Giá trị của lời xin lỗi nằm ở sự thấu cảm chân thành với nỗi đau của người khác chứ không phải sự vị kỷ của người nói',
      'Im lặng luôn là cách giải quyết mâu thuẫn tốt nhất trong mọi hoàn cảnh',
      'Ngôn từ hoàn toàn bất lực trong việc hàn gắn các mối quan hệ xã hội',
    ],
    correctAnswer: 1,
    explanation:
      'Tác giả phê phán kiểu xin lỗi hình thức, vị kỷ (“chỉ để tự giải thoát cho sự áy náy”) và đề cao sự thấu cảm thực sự đối với tổn thương của người nghe.',
    relatedKnowledge: 'Đọc hiểu hàm ý và thông điệp đạo đức - nhân sinh trong câu văn triết lý.',
    memoryTip: 'Phân biệt giữa hành vi hình thức vì bản thân và sự thấu cảm chân thành hướng tới tha nhân.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },

  // ============================================================================
  // CHỦ ĐỀ 2: TIẾNG VIỆT (Q012 - Q022)
  // ============================================================================
  {
    id: 'Q012',
    topic: 'Tiếng Việt',
    difficulty: 'Dễ',
    content: 'Chọn từ viết ĐÚNG chính tả tiếng Việt trong các phương án sau:',
    options: [
      'Chắt chiu',
      'Chắt triu',
      'Trắt chiu',
      'Trắt triu',
    ],
    correctAnswer: 0,
    explanation:
      '“Chắt chiu” là từ ghép đẳng lập đúng chính tả, mang nghĩa dành dụm cẩn thận từng chút một và chăm chút nâng niu.',
    relatedKnowledge: 'Quy tắc chính tả phân biệt phụ âm đầu ch/tr trong tiếng Việt.',
    memoryTip: 'Các từ láy hoặc ghép chỉ sự chăm chút, dành dụm trong gia đình thường đi với “ch” (chắt chiu, chăm chút).',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q013',
    topic: 'Tiếng Việt',
    difficulty: 'Trung bình',
    content: 'Câu nào sau đây mắc lỗi thiếu chủ ngữ?',
    options: [
      'Qua tác phẩm “Vợ nhặt” của Kim Lân đã cho thấy vẻ đẹp khát vọng sống của người nông dân.',
      'Tác phẩm “Vợ nhặt” của Kim Lân đã cho thấy vẻ đẹp khát vọng sống của người nông dân.',
      'Qua tác phẩm “Vợ nhặt”, nhà văn Kim Lân đã cho thấy vẻ đẹp khát vọng sống của người nông dân.',
      'Người nông dân trong tác phẩm “Vợ nhặt” luôn hướng về ánh sáng và tương lai.',
    ],
    correctAnswer: 0,
    explanation:
      'Câu A mở đầu bằng quan hệ từ “Qua” biến cụm danh từ “tác phẩm Vợ nhặt của Kim Lân” thành trạng ngữ, dẫn đến câu chỉ có Trạng ngữ + Vị ngữ (“đã cho thấy...”) mà khuyết Chủ ngữ.',
    relatedKnowledge: 'Lỗi ngữ pháp câu thiếu thành phần nòng cốt (chủ ngữ) và cách khắc phục.',
    memoryTip: 'Khi đầu câu có “Qua / Thông qua / Với / Từ...” mà theo sau là “đã cho thấy / đã thể hiện” (không có dấu phẩy và danh từ chỉ chủ thể) -> Câu thiếu chủ ngữ.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q014',
    topic: 'Tiếng Việt',
    difficulty: 'Dễ',
    passage:
      '“Tre giữ làng, giữ nước, giữ mái nhà tranh, giữ đồng lúa chín. Tre hi sinh để bảo vệ con người.” (Thép Mới)',
    content: 'Hai câu văn trên liên kết với nhau chủ yếu bằng phép liên kết hình thức nào?',
    options: [
      'Phép thế đại từ',
      'Phép lặp từ ngữ (“Tre”)',
      'Phép nối bằng quan hệ từ tương phản',
      'Phép tỉnh lược vị ngữ',
    ],
    correctAnswer: 1,
    explanation:
      'Từ “Tre” ở đầu câu thứ nhất được lặp lại ở đầu câu thứ hai nhằm duy trì chủ đề và tạo nhịp điệu trang trọng.',
    relatedKnowledge: 'Các phép liên kết hình thức giữa các câu trong đoạn văn (lặp, thế, nối, đồng nghĩa/trái nghĩa/liên tưởng).',
    memoryTip: 'Tìm từ ngữ xuất hiện ở cả hai câu kế tiếp nhau cùng quy chiếu về một đối tượng.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q015',
    topic: 'Tiếng Việt',
    difficulty: 'Trung bình',
    content: 'Trong các từ sau, từ nào là từ láy toàn bộ (có biến đổi thanh điệu)?',
    options: [
      'Đo đỏ',
      'Tươi tốt',
      'Máu mủ',
      'Chùa chiền',
    ],
    correctAnswer: 0,
    explanation:
      '“Đo đỏ” là từ láy toàn bộ từ tiếng gốc “đỏ” (biến thanh từ thanh hỏi sang thanh ngang ở tiếng đứng trước để giảm nhẹ mức độ). “Tươi tốt”, “máu mủ”, “chùa chiền” đều là từ ghép đẳng lập vì cả hai tiếng đều có nghĩa.',
    relatedKnowledge: 'Phân biệt từ láy và từ ghép có hình thức trùng lặp phụ âm đầu.',
    memoryTip: 'Nếu cả hai tiếng đều có nghĩa rõ ràng khi đứng độc lập (tươi + tốt, máu + mủ) thì đó là từ ghép, không phải từ láy.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q016',
    topic: 'Tiếng Việt',
    difficulty: 'Trung bình',
    content: 'Xác định thành phần biệt lập trong câu sau: “Chắc chắn, tinh thần tự học là chìa khóa quan trọng nhất để học sinh làm chủ tri thức trong kỷ nguyên số.”',
    options: [
      'Thành phần cảm thán (“Chắc chắn”)',
      'Thành phần tình thái (“Chắc chắn”)',
      'Thành phần phụ chú (“trong kỷ nguyên số”)',
      'Thành phần gọi - đáp (“tinh thần tự học”)',
    ],
    correctAnswer: 1,
    explanation:
      'Từ “Chắc chắn” ở đầu câu thể hiện mức độ tin cậy rất cao của người nói đối với sự việc nêu trong câu, thuộc thành phần biệt lập tình thái.',
    relatedKnowledge: 'Bốn loại thành phần biệt lập trong câu tiếng Việt: tình thái, cảm thán, gọi - đáp, phụ chú.',
    memoryTip: 'Các từ chỉ độ tin cậy (chắc chắn, có lẽ, hình như, dường như) là thành phần tình thái.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q017',
    topic: 'Tiếng Việt',
    difficulty: 'Khó',
    content: 'Câu nào dưới đây mắc lỗi sai về logic ngữ nghĩa (lỗi quy chiếu/đồng đẳng)?',
    options: [
      'Nguyễn Du là đại thi hào dân tộc, tác giả của kiệt tác Truyện Kiều.',
      'Trong thư viện trường em có rất nhiều sách: sách Văn học, sách Lịch sử và cả những cuốn sách mới mua hôm qua.',
      'Văn học dân gian bao gồm các thể loại như thần thoại, sử thi, truyền thuyết, cổ tích, ca dao.',
      'Đọc hiểu văn bản đòi hỏi người học vừa nắm vững kiến thức ngôn ngữ vừa có năng lực suy luận.',
    ],
    correctAnswer: 1,
    explanation:
      'Câu B liệt kê các khái niệm không cùng một tiêu chí phân loại: “sách Văn học, sách Lịch sử” (phân loại theo lĩnh vực nội dung) được đặt ngang hàng với “những cuốn sách mới mua hôm qua” (phân loại theo thời điểm mua).',
    relatedKnowledge: 'Lỗi logic trong câu có thành phần đồng chức (liệt kê khác bình diện phân loại).',
    memoryTip: 'Các thành phần liệt kê nối bằng dấu phẩy và từ “và” phải cùng một tiêu chí phân loại.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q018',
    topic: 'Tiếng Việt',
    difficulty: 'Dễ',
    content: 'Trong các dòng sau, dòng nào gồm toàn các từ Hán Việt?',
    options: [
      'Giang sơn, quốc gia, độc lập, nhân đạo',
      'Non nước, đất trời, tự do, quê hương',
      'Bầu trời, dòng sông, kiến thiết, bảo vệ',
      'Cây cối, làng xóm, hiếu thảo, trung thực',
    ],
    correctAnswer: 0,
    explanation:
      'Cả bốn từ “Giang sơn, quốc gia, độc lập, nhân đạo” đều là từ Hán Việt mang sắc thái trang trọng, khái quát.',
    relatedKnowledge: 'Nhận diện lớp từ Hán Việt và giá trị biểu đạt trong văn bản.',
    memoryTip: 'Kiểm tra từng yếu tố cấu tạo: giang (sông) + sơn (núi), quốc (nước) + gia (nhà)...',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q019',
    topic: 'Tiếng Việt',
    difficulty: 'Trung bình',
    content: 'Câu “Trời ơi, chỉ còn có năm phút!” (Nguyễn Thành Long, Lặng lẽ Sa Pa) thuộc kiểu câu gì xét theo mục đích nói?',
    options: [
      'Câu nghi vấn',
      'Câu cầu khiến',
      'Câu cảm thán',
      'Câu trần thuật',
    ],
    correctAnswer: 2,
    explanation:
      'Câu có từ cảm thán “Trời ơi” và kết thúc bằng dấu chấm than (!), dùng để bộc lộ trực tiếp cảm xúc tiếc nuối, xúc động của nhân vật họa sĩ khi sắp phải chia tay anh thanh niên.',
    relatedKnowledge: 'Phân loại câu theo mục đích nói: nghi vấn, cầu khiến, cảm thán, trần thuật.',
    memoryTip: 'Có từ cảm thán (trời ơi, ôi, than ôi, biết bao...) + bộc lộ cảm xúc + dấu chấm than -> Câu cảm thán.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q020',
    topic: 'Tiếng Việt',
    difficulty: 'Khó',
    content: 'Chọn từ thích hợp nhất điền vào chỗ trống: “Bản thảo nghiên cứu này có nhiều luận điểm mới mẻ nhưng lập luận ở chương hai còn khá ________, thiếu các dẫn chứng thực nghiệm để bảo vệ giả thuyết.”',
    options: [
      'lỏng lẻo',
      'rời rạc',
      'mông lung',
      'hiểm hóc',
    ],
    correctAnswer: 0,
    explanation:
      'Trong ngữ cảnh nhận xét về “lập luận” thiếu dẫn chứng liên kết chặt chẽ với giả thuyết, từ kết hợp chuẩn xác nhất về mặt ngữ pháp và phong cách học thuật là “lập luận lỏng lẻo” (trái nghĩa với “lập luận chặt chẽ”).',
    relatedKnowledge: 'Khả năng kết hợp từ (collocation) trong văn bản nghị luận và khoa học.',
    memoryTip: 'Cặp đối lập chuẩn trong văn nghị luận: Lập luận chặt chẽ >< Lập luận lỏng lẻo.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q021',
    topic: 'Tiếng Việt',
    difficulty: 'Trung bình',
    content: 'Trong câu: “Với lối viết giàu chất thơ, Thạch Lam đã làm dịu đi những tăm tối của phố huyện nghèo”, cụm từ “Với lối viết giàu chất thơ” đóng vai trò ngữ pháp gì?',
    options: [
      'Chủ ngữ',
      'Trạng ngữ chỉ phương tiện/cách thức',
      'Vị ngữ phụ',
      'Khởi ngữ',
    ],
    correctAnswer: 1,
    explanation:
      'Cụm từ mở đầu bằng giới từ “Với...” đứng trước dấu phẩy bổ sung ý nghĩa về phương tiện, cách thức nghệ thuật cho nòng cốt câu “Thạch Lam (CN) / đã làm dịu đi... (VN)”.',
    relatedKnowledge: 'Phân tích cấu trúc ngữ pháp câu tiếng Việt (Trạng ngữ - Chủ ngữ - Vị ngữ).',
    memoryTip: 'Cụm từ bắt đầu bằng “Với...”, ngăn cách bởi dấu phẩy trước Chủ ngữ là Trạng ngữ.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q022',
    topic: 'Tiếng Việt',
    difficulty: 'Vận dụng cao',
    content: 'Hiện tượng chuyển loại từ nào đã diễn ra với từ “mưa” trong câu thơ: “Mưa đổ bụi êm êm trên bến vắng” so với câu “Đêm qua trời mưa rất to”?',
    options: [
      'Ở câu đầu “mưa” là danh từ làm chủ ngữ; ở câu sau “mưa” là động từ làm vị ngữ',
      'Ở cả hai câu “mưa” đều là tính từ chỉ trạng thái thời tiết',
      'Ở câu đầu “mưa” là động từ; ở câu sau “mưa” là đại từ thay thế',
      'Ở câu đầu “mưa” là phụ từ; ở câu sau “mưa” là quan hệ từ',
    ],
    correctAnswer: 0,
    explanation:
      'Trong “Mưa đổ bụi êm êm...”, “Mưa” là danh từ đóng vai trò chủ ngữ của hành động “đổ bụi”. Trong “Đêm qua trời mưa rất to”, “trời” là chủ ngữ, còn “mưa” là động từ kết hợp với phó từ chỉ mức độ “rất to” làm vị ngữ.',
    relatedKnowledge: 'Từ loại tiếng Việt và hiện tượng chuyển loại của từ trong ngữ cảnh.',
    memoryTip: 'Xét vị trí ngữ pháp và từ đi kèm: đứng trước động từ làm chủ thể -> Danh từ; đi kèm phó từ “đang/đã/rất” sau chủ ngữ “trời” -> Động từ.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },

  // ============================================================================
  // CHỦ ĐỀ 3: NGỮ NGHĨA (Q023 - Q032)
  // ============================================================================
  {
    id: 'Q023',
    topic: 'Ngữ nghĩa',
    difficulty: 'Dễ',
    content: 'Trong câu “Mùa xuân là Tết trồng cây / Làm cho đất nước càng ngày càng xuân” (Hồ Chí Minh), từ “xuân” thứ hai được dùng theo nghĩa nào?',
    options: [
      'Nghĩa gốc: chỉ mùa đầu tiên trong bốn mùa của năm',
      'Nghĩa chuyển: chỉ sự tươi trẻ, tràn đầy sức sống và phát triển',
      'Nghĩa thuật ngữ khí tượng học',
      'Nghĩa địa danh hành chính',
    ],
    correctAnswer: 1,
    explanation:
      'Từ “xuân” thứ nhất mang nghĩa gốc (mùa xuân), còn từ “xuân” thứ hai (đi sau phó từ “càng ngày càng”) được chuyển nghĩa để chỉ sự tươi đẹp, trẻ trung, phát triển phồn vinh của đất nước.',
    relatedKnowledge: 'Từ nhiều nghĩa: nghĩa gốc và nghĩa chuyển trong thơ văn.',
    memoryTip: 'Đi kèm phó từ chỉ mức độ “càng ngày càng...” thì danh từ chỉ mùa đã chuyển sang nghĩa tính chất.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q024',
    topic: 'Ngữ nghĩa',
    difficulty: 'Trung bình',
    content: 'Từ “chín” trong trường hợp nào dưới đây mang nghĩa gốc?',
    options: [
      'Vườn cam ngoài bãi đã chín vàng rực.',
      'Suốt đêm qua anh ấy đã suy nghĩ rất chín về quyết định này.',
      'Tình cảm của hai người đã đến độ chín muồi.',
      'Kinh nghiệm nghề nghiệp của cô ấy ngày càng chín.',
    ],
    correctAnswer: 0,
    explanation:
      'Nghĩa gốc của tính từ “chín” (đối với quả, hạt) là trạng thái phát triển đến giai đoạn hoàn thiện, có màu sắc và hương vị thơm ngon (cam chín vàng). Các câu B, C, D đều dùng theo nghĩa chuyển ẩn dụ chỉ sự thấu đáo, trưởng thành của suy nghĩ/tình cảm.',
    relatedKnowledge: 'Phân biệt nghĩa gốc và nghĩa chuyển theo phương thức ẩn dụ.',
    memoryTip: 'Nghĩa gốc gắn với sự vật cụ thể, cảm nhận trực tiếp bằng giác quan (quả chín, cơm chín).',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q025',
    topic: 'Ngữ nghĩa',
    difficulty: 'Trung bình',
    content: 'Thành ngữ “Đẽo cày giữa đường” dùng để phê phán hiện tượng nào trong cuộc sống?',
    options: [
      'Làm việc cẩu thả, thiếu trách nhiệm với cộng đồng',
      'Thiếu chính kiến, ai góp ý gì cũng nghe theo dẫn đến công việc dở dang, thất bại',
      'Bảo thủ, cố chấp không chịu lắng nghe bất kỳ lời khuyên nào của người khác',
      'Tham lam muốn chiếm đoạt thành quả lao động của người đi đường',
    ],
    correctAnswer: 1,
    explanation:
      'Xuất phát từ truyện ngụ ngôn “Đẽo cày giữa đường”, thành ngữ này chỉ người không có chủ kiến độc lập, dễ dao động trước ý kiến trái chiều của đám đông nên cuối cùng hỏng việc.',
    relatedKnowledge: 'Giải nghĩa thành ngữ, tục ngữ Việt Nam trong ngữ cảnh giao tiếp.',
    memoryTip: 'Đẽo cày giữa đường = Không có lập trường, ai nói gì cũng sửa theo -> Hỏng việc.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q026',
    topic: 'Ngữ nghĩa',
    difficulty: 'Dễ',
    content: 'Tìm từ trái nghĩa với từ “hào phóng” trong câu: “Ông ấy là một người rất hào phóng trong các hoạt động thiện nguyện.”',
    options: [
      'Rộng lượng',
      'Keo kiệt',
      'Khiêm tốn',
      'Cẩn trọng',
    ],
    correctAnswer: 1,
    explanation:
      '“Hào phóng” có nghĩa là rộng rãi, sẵn sàng chi dùng hoặc giúp đỡ người khác không tiếc tiền của; trái nghĩa trực tiếp với nó là “keo kiệt” (bủn xỉn, bóp chắt).',
    relatedKnowledge: 'Quan hệ từ trái nghĩa trong hệ thống từ vựng tiếng Việt.',
    memoryTip: 'Đặt từ vào cùng trục nghĩa về thái độ đối với tiền bạc/vật chất: Hào phóng >< Keo kiệt.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q027',
    topic: 'Ngữ nghĩa',
    difficulty: 'Khó',
    content: 'Giải thích chính xác nghĩa của từ Hán Việt “tiệm tiến” trong câu: “Đổi mới giáo dục là một quá trình tiệm tiến, đòi hỏi sự kiên trì và đồng bộ.”',
    options: [
      'Diễn ra đột ngột, nhảy vọt trong thời gian cực ngắn',
      'Tiến lên dần dần từng bước một, từ thấp đến cao',
      'Lùi lại phía sau để bảo toàn lực lượng',
      'Lặp đi lặp lại theo một vòng tròn khép kín',
    ],
    correctAnswer: 1,
    explanation:
      'Trong Hán Việt, “tiệm” (漸) có nghĩa là dần dần, từng bước; “tiến” (進) là tiến lên. “Tiệm tiến” nghĩa là phát triển, tiến lên từng bước một cách tuần tự.',
    relatedKnowledge: 'Giải nghĩa từ Hán Việt dựa vào chiết tự yếu tố cấu tạo.',
    memoryTip: 'Tiệm = dần dần (như tiệm cận = gần dần); Tiến = tiến lên -> Tiệm tiến = tiến lên từng bước.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q028',
    topic: 'Ngữ nghĩa',
    difficulty: 'Trung bình',
    content: 'Các từ “cho, biếu, tặng, hiến” là nhóm từ đồng nghĩa nhưng khác nhau chủ yếu ở phương diện nào?',
    options: [
      'Khác nhau hoàn toàn về hành động vật lý',
      'Khác nhau về sắc thái biểu cảm, thái độ tôn kính và vị thế giao tiếp giữa người trao và người nhận',
      'Khác nhau về vùng miền phương ngữ Bắc - Trung - Nam',
      'Khác nhau về thời điểm thực hiện hành động trong năm',
    ],
    correctAnswer: 1,
    explanation:
      'Cả 4 từ đều chỉ hành động chuyển quyền sở hữu cho người khác không đòi hỏi đền đáp, nhưng khác nhau về sắc thái biểu cảm: “cho” (trung hòa hoặc trên với dưới), “biếu” (kính trọng, dưới với trên), “tặng” (trân trọng, lịch sự), “hiến” (thiêng liêng, cao cả cho cộng đồng/Tổ quốc).',
    relatedKnowledge: 'Từ đồng nghĩa và sự phân biệt sắc thái biểu cảm trong lựa chọn từ ngữ.',
    memoryTip: 'Từ đồng nghĩa không đồng nhất tuyệt đối mà phân hóa theo sắc thái trang trọng/thân mật.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q029',
    topic: 'Ngữ nghĩa',
    difficulty: 'Khó',
    passage:
      '“Bác đã đi rồi sao, Bác ơi!\nMùa thu đang đẹp, nắng xanh trời” (Tố Hữu)',
    content: 'Từ “đi” trong câu thơ “Bác đã đi rồi sao, Bác ơi!” được sử dụng theo sắc thái ngữ nghĩa nào?',
    options: [
      'Nghĩa thông thường chỉ sự di chuyển bằng hai chân từ nơi này sang nơi khác',
      'Biện pháp nói giảm nói tránh chỉ sự qua đời, thể hiện niềm tiếc thương vô hạn và niềm tin Bác vẫn còn mãi',
      'Nghĩa thuật ngữ chỉ chuyến công tác ngoại giao ở nước ngoài',
      'Nghĩa phóng đại nhằm nhấn mạnh khoảng cách địa lý xa xôi',
    ],
    correctAnswer: 1,
    explanation:
      'Từ “đi” được dùng theo lối nói giảm nói tránh (uyển ngữ) thay cho từ “mất / qua đời”, vừa làm giảm nhẹ nỗi đau thương mất mát vừa gợi cảm giác Bác Hồ vẫn còn sống mãi cùng non sông.',
    relatedKnowledge: 'Nghĩa hàm ẩn và sắc thái biểu cảm của từ ngữ trong ngữ cảnh thơ trữ tình.',
    memoryTip: 'Đi / Ra đi / Yên nghỉ trong ngữ cảnh tiễn biệt = Nói giảm nói tránh.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q030',
    topic: 'Ngữ nghĩa',
    difficulty: 'Trung bình',
    content: 'Trong các câu sau, câu nào chứa cặp từ đồng âm (chứ không phải từ nhiều nghĩa)?',
    options: [
      'Con ngựa đang đứng cạnh conngựa gỗ trong sân.',
      'Bàn tay ta làm nên tất cả, có sức người sỏi đá cũng thành cơm.',
      'Ruồi đậu mâm xôi đậu.',
      'Chân bàn gỗ này đã bị gãy một chiếc chân.',
    ],
    correctAnswer: 2,
    explanation:
      'Trong câu “Ruồi đậu mâm xôi đậu”, từ “đậu” thứ nhất là động từ (dừng lại, bám vào một chỗ), còn từ “đậu” thứ hai là danh từ (hạt đỗ/đậu dùng nấu xôi). Hai từ này trùng nhau ngẫu nhiên về âm thanh nhưng hoàn toàn không có mối liên hệ nào về nghĩa -> Từ đồng âm.',
    relatedKnowledge: 'Phân biệt hiện tượng từ đồng âm và từ nhiều nghĩa.',
    memoryTip: 'Nếu hai nghĩa không có bất kỳ nét nghĩa chung hay cơ sở liên tưởng nào -> Từ đồng âm.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q031',
    topic: 'Ngữ nghĩa',
    difficulty: 'Khó',
    content: 'Từ “hàn lâm” trong cụm từ “nghiên cứu hàn lâm” có nghĩa gần nhất với phương án nào?',
    options: [
      'Mang tính ứng dụng thương mại tức thời trên thị trường bán lẻ',
      'Mang tính học thuật chuyên sâu, chuẩn mực và thiên về lý thuyết khoa học',
      'Mang tính giải trí đại chúng, dễ hiểu với mọi lứa tuổi',
      'Mang tính ngẫu hứng, tự phát trong giao tiếp đời thường',
    ],
    correctAnswer: 1,
    explanation:
      '“Hàn lâm” (vốn chỉ viện nghiên cứu tối cao thời xưa, tương ứng với academic) hiện nay dùng để chỉ tính chất học thuật chuyên sâu, chuẩn mực, có hệ thống lý thuyết chặt chẽ.',
    relatedKnowledge: 'Mở rộng vốn từ học thuật và thuật ngữ trong văn bản khoa học - nghị luận.',
    memoryTip: 'Hàn lâm = Học thuật chuyên sâu, chuẩn mực (Academic).',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q032',
    topic: 'Ngữ nghĩa',
    difficulty: 'Vận dụng cao',
    passage:
      '“Cái đẹp cứu chuộc thế giới không phải bằng quyền lực áp đặt, mà bằng khả năng đánh thức phần người đang ngủ quên trong mỗi tâm hồn.”',
    content: 'Cụm từ “phần người đang ngủ quên” trong câu văn trên được hiểu theo nghĩa hàm ẩn nào?',
    options: [
      'Trạng thái nghỉ ngơi sinh học của cơ thể sau một ngày lao động mệt mỏi',
      'Những phẩm chất lương thiện, lòng trắc ẩn và khả năng rung động thẩm mỹ bị che lấp bởi sự vô cảm hoặc toan tính đời thường',
      'Những bản năng sinh tồn nguyên thủy của loài người thời tiền sử',
      'Khả năng ghi nhớ máy móc các kiến thức sách vở trong nhà trường',
    ],
    correctAnswer: 1,
    explanation:
      'Trong mỹ học và văn học nhân văn, “phần người” đối lập với sự vô cảm, thực dụng; “đang ngủ quên” là ẩn dụ cho những giá trị lương tri, lòng trắc ẩn, tình yêu thương vốn có nhưng tạm thời bị che khuất.',
    relatedKnowledge: 'Giải mã nghĩa hàm ẩn và hình ảnh biểu trưng trong câu văn triết lý mỹ học.',
    memoryTip: '“Phần người” = Nhân tính, lương tri, lòng trắc ẩn.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },

  // ============================================================================
  // CHỦ ĐỀ 4: BIỆN PHÁP TU TỪ (Q033 - Q043)
  // ============================================================================
  {
    id: 'Q033',
    topic: 'Biện pháp tu từ',
    difficulty: 'Dễ',
    passage:
      '“Công cha như núi Thái Sơn\nNghĩa mẹ như nước trong nguồn chảy ra”',
    passageSource: 'Ca dao Việt Nam',
    content: 'Biện pháp tu từ nổi bật nhất được sử dụng trong hai câu ca dao trên là gì?',
    options: [
      'Hoán dụ',
      'So sánh',
      'Chơi chữ',
      'Nói ngược',
    ],
    correctAnswer: 1,
    explanation:
      'Hai câu ca dao sử dụng từ so sánh “như” để đối chiếu “Công cha” với “núi Thái Sơn” và “Nghĩa mẹ” với “nước trong nguồn chảy ra”, làm nổi bật công lao to lớn, vô tận của cha mẹ.',
    relatedKnowledge: 'Biện pháp tu từ so sánh và tác dụng gợi hình, gợi cảm trong ca dao.',
    memoryTip: 'Cấu trúc A như B là dấu hiệu điển hình nhất của phép so sánh ngang bằng.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q034',
    topic: 'Biện pháp tu từ',
    difficulty: 'Trung bình',
    passage:
      '“Áo chàm đưa buổi phân li\nCầm tay nhau biết nói gì hôm nay...”',
    passageSource: 'Tố Hữu, Việt Bắc',
    content: 'Hình ảnh “Áo chàm” trong câu thơ trên sử dụng biện pháp tu từ nào?',
    options: [
      'Ẩn dụ chuyển đổi cảm giác',
      'Hoán dụ lấy dấu hiệu của sự vật (trang phục) để gọi sự vật (đồng bào Việt Bắc)',
      'Nhân hóa trang phục thành con người',
      'Nói quá làm tăng quy mô cuộc chia tay',
    ],
    correctAnswer: 1,
    explanation:
      '“Áo chàm” là trang phục truyền thống quen thuộc của đồng bào các dân tộc vùng chiến khu Việt Bắc. Lấy trang phục gắn liền với con người để chỉ chính những người dân Việt Bắc là biện pháp hoán dụ (quan hệ tương cận).',
    relatedKnowledge: 'Phân biệt ẩn dụ (quan hệ tương đồng) và hoán dụ (quan hệ tương cận/gần gũi).',
    memoryTip: 'Trang phục / Bộ phận cơ thể / Vật dụng gắn liền với người -> Hoán dụ.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q035',
    topic: 'Biện pháp tu từ',
    difficulty: 'Trung bình',
    passage:
      '“Ơi con chim chiền chiện\nHót chi mà vang trời\nTừng giọt long lanh rơi\nTôi đưa tay tôi hứng.”',
    passageSource: 'Thanh Hải, Mùa xuân nho nhỏ',
    content: 'Hai câu thơ “Từng giọt long lanh rơi / Tôi đưa tay tôi hứng” sử dụng biện pháp tu từ đặc sắc nào?',
    options: [
      'Ẩn dụ chuyển đổi cảm giác',
      'Hoán dụ lấy cái cụ thể chỉ cái trừu tượng',
      'Liệt kê tăng tiến',
      'Chơi chữ đồng âm',
    ],
    correctAnswer: 0,
    explanation:
      'Tiếng chim hót vốn được cảm nhận bằng thính giác (“vang trời”), nhưng nhà thơ lại cảm nhận nó kết đọng thành “từng giọt long lanh” (thị giác) và “đưa tay tôi hứng” (xúc giác). Đó là phép ẩn dụ chuyển đổi cảm giác.',
    relatedKnowledge: 'Biện pháp ẩn dụ chuyển đổi cảm giác trong thơ trữ tình hiện đại.',
    memoryTip: 'Chuyển từ nghe (âm thanh) sang nhìn (hình khối/màu sắc) hoặc chạm (xúc giác) -> Ẩn dụ chuyển đổi cảm giác.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q036',
    topic: 'Biện pháp tu từ',
    difficulty: 'Dễ',
    passage:
      '“Núi cao chi lắm núi ơi\nNúi che mặt trời chẳng thấy người thương!”',
    passageSource: 'Ca dao Việt Nam',
    content: 'Cách trò chuyện, trách móc “Núi cao chi lắm núi ơi” thể hiện biện pháp tu từ nào?',
    options: [
      'Nhân hóa',
      'Liệt kê',
      'Chêm xen',
      'Nói giảm nói tránh',
    ],
    correctAnswer: 0,
    explanation:
      'Tác giả dân gian gọi “núi ơi” và trò chuyện, trách móc núi như một con người có tâm hồn, tri giác -> Biện pháp nhân hóa.',
    relatedKnowledge: 'Các kiểu nhân hóa: dùng từ gọi người để gọi vật, dùng từ chỉ hoạt động/tính chất của người cho vật.',
    memoryTip: 'Gọi “... ơi” với sự vật thiên nhiên = Nhân hóa.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q037',
    topic: 'Biện pháp tu từ',
    difficulty: 'Trung bình',
    passage:
      '“Tài cao phận thấp chí khí uất\nGiang hồ mê chơi quên quê hương”',
    passageSource: 'Tản Đà, Thăm mả cũ bên đường',
    content: 'Cụm từ “Tài cao phận thấp” sử dụng phép tu từ nào?',
    options: [
      'Tiểu đối (tương phản)',
      'Nói giảm nói tránh',
      'Hoán dụ',
      'Điệp cấu trúc vòng',
    ],
    correctAnswer: 0,
    explanation:
      '“Tài cao” và “phận thấp” tạo thành thế tiểu đối ngay trong một vế câu, làm nổi bật bi kịch của người trí thức tài hoa nhưng gặp cảnh ngộ bế tắc trong xã hội cũ.',
    relatedKnowledge: 'Phép đối (trường đối và tiểu đối) trong thơ ca cổ điển và hiện đại.',
    memoryTip: 'Hai cụm từ đẳng lập mang nghĩa trái ngược đứng liền nhau trong một câu (Tài cao >< phận thấp) là tiểu đối.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q038',
    topic: 'Biện pháp tu từ',
    difficulty: 'Khó',
    passage:
      '“Lom khom dưới núi, tiều vài chú\nLác đác bên sông, chợ mấy nhà”',
    passageSource: 'Bà Huyện Thanh Quan, Qua Đèo Ngang',
    content: 'Hiệu quả nghệ thuật chính của phép đảo ngữ (đưa “Lom khom”, “Lác đác” lên đầu câu) kết hợp với phép đối trong hai câu thơ trên là gì?',
    options: [
      'Nhấn mạnh sự sầm uất, nhộn nhịp của đời sống cư dân vùng Đèo Ngang',
      'Nhấn mạnh dáng vẻ nhỏ bé, thưa thớt, tiêu điều của sự sống con người trước thiên nhiên hoang sơ, mênh mông',
      'Thể hiện niềm vui thích khám phá danh lam thắng cảnh mới lạ',
      'Mô tả tốc độ lao động khẩn trương của những người tiều phu',
    ],
    correctAnswer: 1,
    explanation:
      'Đưa các từ láy tượng hình “Lom khom”, “Lác đác” lên đầu câu kết hợp với số từ ít ỏi (“vài chú”, “mấy nhà”) giúp tô đậm sự nhỏ nhoi, thưa vắng của con người giữa cảnh chiều Đèo Ngang heo hút.',
    relatedKnowledge: 'Biện pháp đảo ngữ và giá trị biểu đạt trong thơ Đường luật.',
    memoryTip: 'Đảo vị ngữ/từ láy lên đầu câu luôn nhằm nhấn mạnh ấn tượng thị giác hoặc cảm xúc mà từ đó biểu thị.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q039',
    topic: 'Biện pháp tu từ',
    difficulty: 'Trung bình',
    passage:
      '“Bàn tay ta làm nên tất cả\nCó sức người sỏi đá cũng thành cơm.”',
    passageSource: 'Hoàng Trung Thông, Bài ca vỡ đất',
    content: 'Trong hai câu thơ trên, tác giả đã kết hợp những biện pháp tu từ nào ở hình ảnh “Bàn tay ta” và “sỏi đá cũng thành cơm”?',
    options: [
      'Hoán dụ (“Bàn tay ta”) kết hợp với ẩn dụ/nói quá (“sỏi đá cũng thành cơm”)',
      'Nhân hóa (“Bàn tay ta”) kết hợp với chơi chữ (“sỏi đá”)',
      'Điệp từ kết hợp với câu hỏi tu từ',
      'Liệt kê kết hợp với nói giảm nói tránh',
    ],
    correctAnswer: 0,
    explanation:
      '“Bàn tay ta” là hoán dụ lấy bộ phận cơ thể chỉ người lao động; “sỏi đá” (ẩn dụ cho thiên nhiên khắc nghiệt, cằn cỗi) biến thành “cơm” (ẩn dụ cho thành quả ấm no) kết hợp lối nói phóng đại ngợi ca sức mạnh cải tạo thiên nhiên của con người.',
    relatedKnowledge: 'Sự phối hợp nhiều biện pháp tu từ trong cùng một cặp câu thơ.',
    memoryTip: 'Bàn tay = Hoán dụ bộ phận - toàn thể; Sỏi đá thành cơm = Ẩn dụ + Nói quá.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q040',
    topic: 'Biện pháp tu từ',
    difficulty: 'Khó',
    passage:
      '“Sao anh không về chơi thôn Vĩ?\nNhìn nắng hàng cau nắng mới lên”',
    passageSource: 'Hàn Mặc Tử, Đây thôn Vĩ Dạ',
    content: 'Câu thơ “Sao anh không về chơi thôn Vĩ?” sử dụng biện pháp tu từ gì và mang sắc thái biểu cảm nào?',
    options: [
      'Câu hỏi tu từ – vừa là lời hỏi han, lời mời gọi tha thiết, vừa là lời tự trách và nỗi niềm khắc khoải của chủ thể trữ tình',
      'Câu mệnh lệnh bắt buộc người nghe phải lập tức lên đường',
      'Câu nghi vấn thông thường nhằm tra cứu thông tin lịch trình tàu xe',
      'Phép nói quá nhằm cường điệu hóa khoảng cách địa lý',
    ],
    correctAnswer: 0,
    explanation:
      'Dưới hình thức một câu hỏi tu từ đa thanh, câu thơ vừa như lời trách nhẹ nhàng, lời mời gọi ân cần của người con gái xứ Huế, vừa là sự phân thân tự hỏi đầy nuối tiếc, khao khát của chính nhà thơ.',
    relatedKnowledge: 'Câu hỏi tu từ và tính đa nghĩa trong thơ Hàn Mặc Tử.',
    memoryTip: 'Câu hỏi trong thơ trữ tình không nhằm đòi hỏi câu trả lời thông tin -> Câu hỏi tu từ bộc lộ cảm xúc.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q041',
    topic: 'Biện pháp tu từ',
    difficulty: 'Trung bình',
    passage:
      '“Cùng trông lại mà cùng chẳng thấy\nThấy xanh xanh những mấy ngàn dâu\nNgàn dâu xanh ngắt một màu\nLòng chàng ý thiếp ai sầu hơn ai?”',
    passageSource: 'Đặng Trần Côn – Đoàn Thị Điểm, Chinh phụ ngâm',
    content: 'Việc lặp lại cụm từ “ngàn dâu” ở cuối câu thơ thứ hai và đầu câu thơ thứ ba được gọi là biện pháp tu từ gì?',
    options: [
      'Điệp ngữ nối tiếp (điệp liên hoàn / điệp vòng)',
      'Điệp ngữ cách quãng ngẫu nhiên',
      'Chơi chữ nói lái',
      'Hoán dụ lấy vật chứa đựng chỉ vật bị chứa đựng',
    ],
    correctAnswer: 0,
    explanation:
      'Chữ cuối của câu trước (“ngàn dâu”) được lặp lại làm chữ mở đầu của câu tiếp theo gọi là điệp ngữ vòng (điệp liên hoàn), tạo cảm giác không gian bát ngát nối tiếp triền miên như nỗi sầu chia ly.',
    relatedKnowledge: 'Các dạng điệp ngữ: điệp nối tiếp, điệp cách quãng, điệp vòng (liên hoàn).',
    memoryTip: 'Cuối câu trước lặp lại ở đầu câu sau = Điệp vòng / Điệp liên hoàn.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q042',
    topic: 'Biện pháp tu từ',
    difficulty: 'Khó',
    passage:
      '“Cô Xuân đi chợ mùa hè\nMua cá thu về, chợ hãy còn đông.”',
    passageSource: 'Câu đối / Ca dao dân gian',
    content: 'Biện pháp tu từ chủ đạo tạo nên sự thú vị trong hai câu trên là gì?',
    options: [
      'Chơi chữ bằng cách sử dụng các từ đồng âm và trường từ vựng chỉ bốn mùa (Xuân, hè/hạ, thu, đông)',
      'Ẩn dụ chuyển đổi cảm giác từ thị giác sang vị giác',
      'Nói giảm nói tránh về sự vất vả của người đi chợ',
      'Đảo ngữ vị ngữ lên trước chủ ngữ',
    ],
    correctAnswer: 0,
    explanation:
      'Câu ca dao khéo léo cài đặt tên 4 mùa: Xuân (tên người) – hè (mùa hè) – thu (cá thu) – đông (chợ đông người), tạo nên lối chơi chữ đồng âm kết hợp trường liên tưởng bốn mùa rất độc đáo.',
    relatedKnowledge: 'Các lối chơi chữ trong tiếng Việt: dùng từ đồng âm, gần âm, nói lái, từ cùng trường nghĩa.',
    memoryTip: 'Nhận diện chuỗi từ Xuân - Hạ (Hè) - Thu - Đông ẩn trong tên riêng, tên vật và tính từ.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q043',
    topic: 'Biện pháp tu từ',
    difficulty: 'Vận dụng cao',
    passage:
      '“Còn trời, còn nước, còn non\nCòn cô bán rượu anh còn say sưa.”',
    passageSource: 'Ca dao Việt Nam',
    content: 'Phân tích sự kết hợp giữa điệp từ “còn” và tính đa nghĩa của từ “say sưa” trong câu ca dao trên:',
    options: [
      'Điệp từ “còn” khẳng định sự vĩnh cửu; “say sưa” vừa chỉ trạng thái say rượu (nghĩa đen) vừa chỉ sự đắm say, quyến luyến tình cảm (nghĩa bóng)',
      'Điệp từ “còn” diễn tả sự tiếc nuối; “say sưa” chỉ thói quen nghiện rượu đáng phê phán',
      'Điệp từ “còn” tạo nhịp điệu buồn bã; “say sưa” chỉ trạng thái say sóng trên sông nước',
      'Điệp từ “còn” phủ định thực tại; “say sưa” là thuật ngữ y học',
    ],
    correctAnswer: 0,
    explanation:
      'Điệp từ “còn” lặp lại 5 lần gắn tình cảm của chàng trai với sự trường tồn của thiên nhiên (trời, nước, non); từ “say sưa” hàm chứa nét nghĩa kép tinh tế: mượn chuyện say rượu để bày tỏ nỗi say tình.',
    relatedKnowledge: 'Phân tích giá trị thẩm mỹ của điệp từ kết hợp từ đa nghĩa trong ca dao trữ tình.',
    memoryTip: 'Trong ca dao giao duyên, “say rượu / say trầu / say thuốc” luôn ẩn ý “say tình”.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },

  // ============================================================================
  // CHỦ ĐỀ 5: PHONG CÁCH NGÔN NGỮ (Q044 - Q053)
  // ============================================================================
  {
    id: 'Q044',
    topic: 'Phong cách ngôn ngữ',
    difficulty: 'Dễ',
    passage:
      '“Căn cứ Quyết định số 145/QĐ-THPT ngày 05 tháng 9 năm 2026 của Hiệu trưởng Trường THPT Yên Lãng về việc ban hành Kế hoạch hoạt động chuyên môn và phát triển sản phẩm học tập số năm học 2026–2027...”',
    content: 'Đoạn trích trên thuộc phong cách ngôn ngữ nào?',
    options: [
      'Phong cách ngôn ngữ sinh hoạt',
      'Phong cách ngôn ngữ hành chính',
      'Phong cách ngôn ngữ nghệ thuật',
      'Phong cách ngôn ngữ báo chí',
    ],
    correctAnswer: 1,
    explanation:
      'Đoạn văn có hệ thống thuật ngữ và khuôn mẫu hành chính điển hình (“Căn cứ Quyết định số... của Hiệu trưởng... về việc ban hành...”), thuộc phong cách ngôn ngữ hành chính.',
    relatedKnowledge: 'Đặc trưng của phong cách ngôn ngữ hành chính: tính khuôn mẫu, tính minh xác, tính công vụ.',
    memoryTip: 'Có số hiệu văn bản, “Căn cứ Quyết định/Nghị định/Thông tư...” -> Phong cách ngôn ngữ hành chính.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q045',
    topic: 'Phong cách ngôn ngữ',
    difficulty: 'Dễ',
    passage:
      '“Hiện tượng quang hợp ở thực vật là quá trình sử dụng năng lượng ánh sáng mặt trời đã được diệp lục hấp thụ để tổng hợp cacbohidrat và giải phóng oxy từ khí cacbonic và nước.”',
    content: 'Văn bản trên mang đặc trưng của phong cách ngôn ngữ nào?',
    options: [
      'Phong cách ngôn ngữ khoa học',
      'Phong cách ngôn ngữ chính luận',
      'Phong cách ngôn ngữ nghệ thuật',
      'Phong cách ngôn ngữ sinh hoạt',
    ],
    correctAnswer: 0,
    explanation:
      'Câu văn định nghĩa chính xác một khái niệm sinh học bằng hệ thống thuật ngữ chuyên ngành (“quang hợp, diệp lục, cacbohidrat, oxy, cacbonic”), mang tính trừu tượng, khái quát và khách quan của phong cách ngôn ngữ khoa học.',
    relatedKnowledge: 'Đặc trưng của phong cách ngôn ngữ khoa học: tính khái quát, trừu tượng, tính lý trí, logic và hệ thống thuật ngữ.',
    memoryTip: 'Định nghĩa khái niệm tự nhiên/xã hội + thuật ngữ chuyên ngành + không dùng từ biểu cảm -> Khoa học.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q046',
    topic: 'Phong cách ngôn ngữ',
    difficulty: 'Trung bình',
    passage:
      '“Sáng ngày 15/10, tại Hà Nội, Diễn đàn Chuyển đổi số Giáo dục phổ thông năm 2026 đã chính thức khai mạc với sự tham gia của hơn 500 đại biểu là các chuyên gia, giáo viên và học sinh tiêu biểu trên toàn quốc.”',
    content: 'Đoạn văn trên thuộc thể loại và phong cách ngôn ngữ nào?',
    options: [
      'Bản tin thời sự – Phong cách ngôn ngữ báo chí',
      'Đơn kiến nghị – Phong cách ngôn ngữ hành chính',
      'Truyện ngắn – Phong cách ngôn ngữ nghệ thuật',
      'Nhật ký cá nhân – Phong cách ngôn ngữ sinh hoạt',
    ],
    correctAnswer: 0,
    explanation:
      'Đoạn văn cung cấp thông tin thời sự xác thực theo công thức 5W1H (Thời gian: Sáng 15/10; Địa điểm: Hà Nội; Sự kiện: Diễn đàn Chuyển đổi số; Thành phần: 500 đại biểu), thuộc thể loại Bản tin trong phong cách ngôn ngữ báo chí.',
    relatedKnowledge: 'Đặc trưng phong cách ngôn ngữ báo chí: tính thông tin thời sự, tính ngắn gọn, tính sinh động hấp dẫn.',
    memoryTip: 'Mở đầu bằng thời gian + địa điểm + sự kiện mới diễn ra -> Bản tin báo chí.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q047',
    topic: 'Phong cách ngôn ngữ',
    difficulty: 'Trung bình',
    passage:
      '“Hỡi đồng bào toàn quốc! Chúng ta muốn hòa bình, chúng ta phải nhân nhượng. Nhưng chúng ta càng nhân nhượng, thực dân Pháp càng lấn tới, vì chúng quyết tâm cướp nước ta lần nữa!”',
    passageSource: 'Hồ Chí Minh, Lời kêu gọi toàn quốc kháng chiến',
    content: 'Đoạn trích trên là mẫu mực của phong cách ngôn ngữ nào?',
    options: [
      'Phong cách ngôn ngữ chính luận',
      'Phong cách ngôn ngữ khoa học',
      'Phong cách ngôn ngữ sinh hoạt',
      'Phong cách ngôn ngữ hành chính',
    ],
    correctAnswer: 0,
    explanation:
      'Đoạn trích bàn về vấn đề chính trị - vận mệnh quốc gia, có lập luận chặt chẽ, lời kêu gọi hùng hồn, giàu sức thuyết phục và truyền cảm hứng hành động -> Phong cách ngôn ngữ chính luận.',
    relatedKnowledge: 'Đặc trưng phong cách ngôn ngữ chính luận: tính công khai về quan điểm chính trị, tính chặt chẽ trong lập luận, tính truyền cảm thuyết phục.',
    memoryTip: 'Bàn về vận mệnh đất nước, quan điểm chính trị - xã hội với lập luận đanh thép -> Chính luận.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q048',
    topic: 'Phong cách ngôn ngữ',
    difficulty: 'Dễ',
    passage:
      '“— Cậu đã làm xong đề luyện tập trên HSA MASTER chưa?\n— Tớ vừa nộp bài xong đấy, phần đọc hiểu nâng cao hôm nay có mấy câu phân tích ngữ liệu hay cực!”',
    content: 'Đoạn hội thoại trên thuộc phong cách ngôn ngữ nào?',
    options: [
      'Phong cách ngôn ngữ sinh hoạt',
      'Phong cách ngôn ngữ hành chính',
      'Phong cách ngôn ngữ khoa học',
      'Phong cách ngôn ngữ chính luận',
    ],
    correctAnswer: 0,
    explanation:
      'Đoạn hội thoại trực tiếp giữa hai người bạn sử dụng đại từ thân mật (“cậu - tớ”) và khẩu ngữ đời thường (“đấy, hay cực!”), mang tính cụ thể, tính cảm xúc và tính cá thể của phong cách ngôn ngữ sinh hoạt.',
    relatedKnowledge: 'Ba đặc trưng cơ bản của phong cách ngôn ngữ sinh hoạt: tính cụ thể, tính cảm xúc, tính cá thể.',
    memoryTip: 'Đối thoại đời thường + từ ngữ khẩu ngữ (đấy, nhỉ, nhé, cực...) -> Phong cách ngôn ngữ sinh hoạt.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q049',
    topic: 'Phong cách ngôn ngữ',
    difficulty: 'Trung bình',
    content: 'Ba đặc trưng cơ bản và cốt lõi nhất của phong cách ngôn ngữ nghệ thuật là gì?',
    options: [
      'Tính khuôn mẫu, tính minh xác, tính công vụ',
      'Tính hình tượng, tính truyền cảm, tính cá thể hóa',
      'Tính trừu tượng, tính lý trí, tính hệ thống thuật ngữ',
      'Tính thời sự cập nhật, tính ngắn gọn, tính thông tin đại chúng',
    ],
    correctAnswer: 1,
    explanation:
      'Phong cách ngôn ngữ nghệ thuật (dùng trong văn chương) có 3 đặc trưng cốt lõi: tính hình tượng (xây dựng hình tượng nghệ thuật), tính truyền cảm (khơi gợi đồng cảm thẩm mỹ) và tính cá thể hóa (dấu ấn giọng điệu riêng của nhà văn).',
    relatedKnowledge: 'Hệ thống đặc trưng của 6 phong cách ngôn ngữ chức năng trong tiếng Việt.',
    memoryTip: 'Nghệ thuật = Hình tượng + Truyền cảm + Cá thể hóa.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q050',
    topic: 'Phong cách ngôn ngữ',
    difficulty: 'Khó',
    content: 'Điểm khác biệt căn bản nhất giữa từ ngữ dùng trong phong cách ngôn ngữ khoa học và từ ngữ dùng trong phong cách ngôn ngữ nghệ thuật là gì?',
    options: [
      'Ngôn ngữ khoa học đòi hỏi tính đơn nghĩa, chính xác của thuật ngữ; ngôn ngữ nghệ thuật giàu tính đa nghĩa, hàm súc và biểu trưng',
      'Ngôn ngữ khoa học chỉ dùng từ thuần Việt; ngôn ngữ nghệ thuật chỉ dùng từ Hán Việt',
      'Ngôn ngữ khoa học không tuân theo quy tắc ngữ pháp; ngôn ngữ nghệ thuật tuân thủ tuyệt đối',
      'Ngôn ngữ khoa học dùng nhiều câu cảm thán; ngôn ngữ nghệ thuật chỉ dùng câu trần thuật',
    ],
    correctAnswer: 0,
    explanation:
      'Trong văn bản khoa học, mỗi thuật ngữ chỉ biểu thị một khái niệm xác định (đơn nghĩa) để tránh hiểu lầm. Ngược lại, trong văn bản nghệ thuật, từ ngữ được tổ chức để mở ra nhiều tầng nghĩa liên tưởng, hàm ngôn („ý tại ngôn ngoại“).',
    relatedKnowledge: 'So sánh đặc điểm từ vựng - ngữ nghĩa giữa các phong cách chức năng.',
    memoryTip: 'Khoa học = Đơn nghĩa, tường minh; Nghệ thuật = Đa nghĩa, hàm súc.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q051',
    topic: 'Phong cách ngôn ngữ',
    difficulty: 'Trung bình',
    content: 'Dòng nào sau đây nêu đúng các thể loại tiêu biểu thuộc phong cách ngôn ngữ báo chí?',
    options: [
      'Bản tin, phóng sự, phỏng vấn, tiểu phẩm báo chí, quảng cáo',
      'Nghị định, thông tư, công văn, đơn từ, biên bản',
      'Luận án, giáo trình, chuyên khảo, bài báo khoa học',
      'Thần thoại, truyền thuyết, truyện cổ tích, ca dao',
    ],
    correctAnswer: 0,
    explanation:
      'Bản tin, phóng sự, phỏng vấn, tiểu phẩm báo chí, thư bạn đọc, quảng cáo là những thể loại đặc trưng của phong cách ngôn ngữ báo chí.',
    relatedKnowledge: 'Phân loại văn bản theo phong cách ngôn ngữ chức năng.',
    memoryTip: 'Bản tin + Phóng sự + Phỏng vấn -> Báo chí.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q052',
    topic: 'Phong cách ngôn ngữ',
    difficulty: 'Khó',
    passage:
      '“Mặt trời là ngôi sao ở trung tâm Hệ Mặt Trời, chiếm khoảng 99,86% khối lượng của toàn hệ.” (Câu 1)\n“Ngày ngày mặt trời đi qua trên lăng / Thấy một mặt trời trong lăng rất đỏ.” (Câu 2 - Viễn Phương)',
    content: 'So sánh chức năng của từ “mặt trời” trong hai câu trên:',
    options: [
      'Ở câu 1, “mặt trời” là thuật ngữ khoa học mang chức năng thông보 nhận thức; ở câu 2, “mặt trời” thứ hai là hình tượng nghệ thuật mang chức năng thẩm mỹ - biểu cảm',
      'Ở cả hai câu, từ “mặt trời” đều là thuật ngữ thiên văn học đơn nghĩa',
      'Ở câu 1 là phong cách sinh hoạt; ở câu 2 là phong cách hành chính',
      'Ở câu 1 dùng nghĩa chuyển ẩn dụ; ở câu 2 dùng nghĩa gốc hoàn toàn',
    ],
    correctAnswer: 0,
    explanation:
      'Câu 1 thuộc phong cách ngôn ngữ khoa học nên “Mặt trời” là thuật ngữ thiên văn khách quan. Câu 2 thuộc phong cách nghệ thuật nên “mặt trời trong lăng” là ẩn dụ nghệ thuật ca ngợi Bác Hồ.',
    relatedKnowledge: 'Sự biến đổi chức năng của ngôn từ khi chuyển từ phong cách khoa học sang phong cách nghệ thuật.',
    memoryTip: 'Khoa học -> Chức năng thông tin nhận thức; Nghệ thuật -> Chức năng thẩm mỹ - biểu cảm.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
  {
    id: 'Q053',
    topic: 'Phong cách ngôn ngữ',
    difficulty: 'Vận dụng cao',
    content: 'Khi viết một bức thư điện tử (email) xin phép giáo viên bộ môn nghỉ học vì lý do sức khỏe, học sinh cần tránh lỗi phong cách nào sau đây?',
    options: [
      'Trình bày rõ họ tên, lớp, lý do xin nghỉ và lời hứa chép bài đầy đủ',
      'Sử dụng ngôn ngữ trang trọng, lịch sự, đúng chuẩn mực giao tiếp sư phạm',
      'Pha trộn ngôn ngữ sinh hoạt suồng sã, viết tắt, tiếng lóng vào văn bản có tính chất hành chính - sư phạm',
      'Ghi rõ tiêu đề thư (Subject) ngắn gọn, tường minh',
    ],
    correctAnswer: 2,
    explanation:
      'Thư/đơn xin phép nghỉ học gửi giáo viên là văn bản giao tiếp chính thức trong môi trường học đường (mang tính hành chính - công vụ), vì vậy việc dùng tiếng lóng, viết tắt, khẩu ngữ suồng sã là lỗi vi phạm chuẩn mực phong cách ngôn ngữ.',
    relatedKnowledge: 'Ứng dụng kiến thức phong cách ngôn ngữ vào thực tiễn giao tiếp học đường.',
    memoryTip: 'Giao tiếp hành chính - sư phạm đòi hỏi tính chuẩn mực, lịch sự, tuyệt đối tránh khẩu ngữ suồng sã.',
    sourceNote: 'Biên soạn phục vụ luyện tập HSA - THPT Yên Lãng',
  },
];
