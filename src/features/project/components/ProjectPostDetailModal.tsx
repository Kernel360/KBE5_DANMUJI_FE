const fetchPostAndComments = async () => {
  if (!postId) return;

  try {
    setLoading(true);
    setError(null);
    const [postResponse, commentsResponse] = await Promise.all([
      getPostDetail(postId),
      getComments(postId),
    ]);

    setPost(postResponse.data);
    setComments(commentsResponse.data);
  } catch (err) {
    // ApiError의 메시지가 성공 메시지인 경우 에러로 표시하지 않음
    if (err instanceof Error && err.message.includes("완료")) {
      console.log(err.message);
    } else {
      setError("게시글 정보를 불러오는 중 오류가 발생했습니다.");
      console.error("게시글 상세 조회 중 오류:", err);
    }
  } finally {
    setLoading(false);
  }
};
