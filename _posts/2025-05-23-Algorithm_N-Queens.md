---
title: Algorithm | N-Queens
date: 2025-05-23 20:19:00 +0900
categories: [Algorithm]
tags:  [Backtracking, N-Queens, DFS, Note]
author: "rniman"                            # for single entry
# or
# authors: [<author1_id>, <author2_id>]   # for multiple entries
description: "N-Queens에 대해 정리한 글입니다."

comments: false # 댓글 기능
---

![queens.jpg](assets/img/Algorithm/queens.jpg)
N-Queen 문제는 대표적인 **백트래킹** 알고리즘 문제로, 체스판 위에 N개의 퀸을 서로 공격하지 않도록 놓는 경우의 수를 구하는 것이다.<br>
이 문제를 처음 접했을 때 나는 단순한 탐색 문제라고 생각했지만, 구현을 하다 보면 효율적인 상태 관리와 탐색 순서 설계의 중요성을 깨달았다.<br>
또한 조건에 대한 가지치기를 설계하는데 무작정하게되면 식이 복잡해지고 구현 난이도가 올라가는 일이 발생하여 해당 내용에 대해 정리하였다.

---

## N-Queens 문제 ✅

- **목표**: N x N 체스판 위에 N개의 퀸을 서로 공격하지 않게 배치
- **제한 조건**:
    - 퀸은 같은 행, 같은 열, 대각선에 위치할 수 없음

### 1. 풀이 아이디어

N-Queen은 각 행에 퀸을 하나씩 배치하면서 다음 행으로 이동하는 방식으로 풀 수 있다. 이 과정에서 조건에 맞지 않으면 더 이상 탐색하지 않고 **백트래킹**한다.

---

### 2. 핵심 아이디어

- 각 행(row)마다 하나의 퀸만 배치
- 현재 퀸이 이전 퀸들과 열(column), 대각선(↘, ↙)에서 겹치는지 확인
- 조건을 만족하면 다음 행으로 이동

---

### 3. 상태 관리

```
- col[i] = true: i번째 열에 퀸이 있음
- diag1[i] = true: ↘ 방향 대각선 사용 중 (row + col)
- diag2[i] = true: ↙ 방향 대각선 사용 중 (row - col + (N - 1))
```

---

### 4. Pseudo-code 예시

```
function solveNQueen(row):
    if row == N:
        count += 1
        return

    for col in 0 to N-1:
		    // 가지치기의 핵심
        if not colUsed[col] and not diag1[row+col] and not diag2[row-col+(N-1)]:
            mark colUsed[col], diag1[row+col], diag2[row-col+(N-1)] as True
            solveNQueen(row + 1)
            backtrack (unmark the above)
```

---

### 5. 시간복잡도

- 최악의 경우는 `O(N!)` 이지만, 백트래킹 조건에 의해 실제 탐색 횟수는 훨씬 줄어든다.
- 효율적인 상태 관리를 통해 N=15 정도까지는 실시간으로 해결 가능하다.

---

### 결론

N-Queen 문제는 단순히 경우의 수를 찾는 문제가 아니라, **탐색의 가지치기를 얼마나 잘 하느냐**가 관건인 문제다. 백트래킹을 학습하는 과정에서 이 문제를 깊이 있게 이해하면, 다른 탐색 문제에서도 유사한 전략을 적용할 수 있을 것 같다.

 이 문제를 Bitmask를 이용해 풀어보는 방식이 있으며 이 방법은 상태 체크를 비트 연산으로 하게 되므로 성능 면에서 더 유리한 점이 있다고 한다.

---

이미지 출처: [https://leetcode.com/problems/n-queens/description/](https://leetcode.com/problems/n-queens/description/)
