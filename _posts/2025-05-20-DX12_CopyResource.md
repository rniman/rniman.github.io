---
title: DirecX12 개인 메모 | CopyResource vs CopyBufferRegion
date: 2025-05-20 00:10:23 +0900
categories: [Rendering, Rendering\DirectX]
tags: [DX12, Resource, Note, Low Level]
author: "rniman"                            # for single entry
# or
# authors: [<author1_id>, <author2_id>]   # for multiple entries
description: "DirectX12 리소스 복사 함수에 관한 글입니다."

comments: false # 댓글 기능
---

이 문서는 Direct3D 12에서 자주 사용되는 두 가지 리소스 복사 방식인 `CopyResource`와 `CopyBufferRegion`의 차이점을 정리한 문서입니다.

---

## 1. `CopyResource` ✅

```cpp
void ID3D12GraphicsCommandList::CopyResource(
    ID3D12Resource* pDstResource,
    ID3D12Resource* pSrcResource);
```

### 개요

- **전체 리소스를 통째로 복사**합니다.
- 소스와 대상 리소스는 **크기와 형식이 같아야 함**

### 특징

- 매우 간단하다.
- 내부적으로 전체 바이트를 GPU에서 복사하는 특징이 있다.
- 버퍼뿐 아니라 **텍스처 등 모든 리소스에 사용 가능**

### 사용 예

- 초기화된 리소스를 다른 GPU 힙으로 복사할 때
- 업로드 버퍼 → 디폴트 버퍼로 전체 복사할 때

---

## 2. `CopyBufferRegion` ✅

```cpp
void ID3D12GraphicsCommandList::CopyBufferRegion(
    ID3D12Resource* pDstBuffer,
    UINT64 DstOffset,
    ID3D12Resource* pSrcBuffer,
    UINT64 SrcOffset,
    UINT64 NumBytes);
```

### 개요

- *버퍼(resource type: buffer)**의 **일부 영역**만 복사합니다.
- `Offset`과 `Size`를 지정할 수 있어 세밀한 제어가 가능하다.

### 특징

- 오직 `Buffer` 타입 리소스에서만 사용 가능하다.
- 부분 복사 가능하다. (예: 여러 정점 중 일부만 복사 등)
- 텍스처 등은 지원되지 않는다.

### 사용 예

- 하나의 큰 업로드 버퍼에서 **버퍼 조각**만 디폴트 힙으로 복사한다.
- 리소스 풀 구현 시 **부분 복사/업데이트**을 작업한다.

---

## 차이 요약 📊

| 항목             | `CopyResource`                   | `CopyBufferRegion`                  |
| ---------------- | -------------------------------- | ----------------------------------- |
| 대상 리소스 유형 | 모든 리소스 (Buffer, Texture 등) | **버퍼(Buffer)**만                  |
| 복사 범위        | 전체 복사                        | 일부 범위 복사 가능                 |
| 유연성           | 낮음                             | 높음 (Offset 지정 가능)             |
| 필요 조건        | 리소스 크기/형식이 같아야 함     | 바이트 단위로 복사 가능, 포맷 무관  |
| 주 사용처        | 버퍼 전체 복사, 텍스처 복사 등   | 버퍼의 일부분만 복사 (정점 일부 등) |

---

## 실전 팁 🧠

| 상황                                       | 추천 API           |
| ------------------------------------------ | ------------------ |
| 정점 버퍼 전체 복사 (`Upload → Default`)   | `CopyResource`     |
| 정점 버퍼 일부만 복사 (`Subrange`)         | `CopyBufferRegion` |
| 텍스처 리소스 복사                         | `CopyResource`     |
| 여러 개의 리소스를 하나의 대형 버퍼로 관리 | `CopyBufferRegion` |

---

## 결론 💬

- **단순하고 전체 복사**: `CopyResource`
- **정밀하고 부분 복사**: `CopyBufferRegion`

둘 다 GPU 명령 리스트에 기록되며, 커맨드 큐에서 실행되기 전까지는 실제 복사되지 않습니다.
