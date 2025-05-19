---
title: DirecX12 개인 메모 | D3D12_HEAP_TYPE_DEFAULT vs D3D12_HEAP_TYPE_UPLOAD
date: 2025-05-20 00:29:20 +0900
categories: [Rendering, DirectX]
tags: [DX12, Resource, Note, LowLevel]
author: "rniman"                            # for single entry
# or
# authors: [<author1_id>, <author2_id>]   # for multiple entries
description: "DirectX12 리소스 힙 타입에 관한 글입니다."

comments: false # 댓글 기능
---

이 문서는 Direct3D 12에서 자주 사용되는 두 가지 힙 타입인 `DEFAULT`와 `UPLOAD`의 차이점과 사용 사례를 정리한 것입니다.

---

## D3D12_HEAP_TYPE_DEFAULT ✅

### 개요

- *GPU 전용 메모리(VRAM)**에 위치한다.
- CPU에서는 직접 접근 불가능하다
- GPU가 접근할 때 가장 빠른 힙 타입

### 사용 용도

- 정점 버퍼(Vertex Buffer)
- 인덱스 버퍼(Index Buffer)
- 텍스처(Texture)
- 결과 출력 UAV 버퍼 등

### 특징

- 데이터를 직접 `memcpy`로 복사할 수 없다.
- 대신 UPLOAD 힙을 거쳐 `CopyResource()`나 `UpdateSubresources()` 등으로 복사해야 한다.

---

## D3D12_HEAP_TYPE_UPLOAD ✅

### 개요

- *CPU에서 직접 접근 가능한 메모리(RAM)**에 위치한다.
- GPU도 접근할 수 있지만 성능은 낮다.
- 보통 자주 갱신되는 데이터용으로 사용한다.

### 사용 용도

- 상수 버퍼(Constant Buffer, CBV)
- CPU에서 정점 데이터를 작성할 경우
- 리소스 초기 업로드용 중간 버퍼

### 특징

- `Map()` 호출로 직접 포인터 얻어 `memcpy()` 가능하다.
- `D3D12_RESOURCE_STATE_GENERIC_READ`로 생성된다.
- GPU와 CPU가 동시에 읽기 가능하다.

---

## 비교 요약 📊

| 항목          | D3D12_HEAP_TYPE_DEFAULT            | D3D12_HEAP_TYPE_UPLOAD     |
| ------------- | ---------------------------------- | -------------------------- |
| 위치          | GPU 전용 메모리 (VRAM)             | CPU 접근 가능 메모리 (RAM) |
| CPU 접근      | ❌ 불가능                           | ✅ 가능 (`Map`)             |
| GPU 접근 속도 | 🟢 매우 빠름                        | 🟡 느림                     |
| 주요 용도     | 렌더링용 리소스 저장               | 업로드/상수버퍼/초기화용   |
| 복사 방식     | Upload Heap → CopyResource 등 필요 | 직접 `memcpy` 가능         |

---

## 실전 팁 🧠

| 상황                                   | 추천 힙 타입 |
| -------------------------------------- | ------------ |
| 정점 버퍼 등 렌더링용 고정 리소스      | `DEFAULT`    |
| 상수 버퍼 (프레임마다 갱신)            | `UPLOAD`     |
| 리소스 업로드용 중간 임시 버퍼         | `UPLOAD`     |
| 텍스처/버퍼를 GPU 전용으로 최적화 저장 | `DEFAULT`    |

---

## 결론 💬

- **`DEFAULT` 힙은 GPU가 빠르게 사용할 수 있는 최종 목적지**
- **`UPLOAD` 힙은 CPU가 데이터를 작성하고 GPU에 전달할 때 중간 단계**
- 대부분의 정점/인덱스/텍스처는 `UPLOAD → DEFAULT` 구조로 전송되며 이 방식이 권장된다.

---

## UPLOAD HEAP → DEFAULT HEAP 과정 🚚

모델 정점(Vertex) 데이터나 인덱스 데이터와 같은 경우 업로드 힙을 거쳐서 디폴트 힙으로 옮겨진다.

### 1단계: `UPLOAD_HEAP`에 데이터 복사 (CPU → Upload Heap)

- 먼저 `D3D12_HEAP_TYPE_UPLOAD` 힙에 리소스를 생성하고,
- `Map()` 함수를 통해 CPU가 데이터를 직접 복사한다.
- 이 힙은 CPU 접근에 최적화되어 있어 초기 데이터 업로드에 사용된다.

### 2단계: `DEFAULT_HEAP`으로 복사 (Upload Heap → GPU VRAM)

- `D3D12_HEAP_TYPE_DEFAULT` 힙에 최종 리소스를 생성하고,
- `UpdateSubresources()` 또는 `CopyBufferRegion()`을 사용해 데이터를 복사한다.
- `DEFAULT_HEAP`은 GPU 전용 메모리이므로 직접 CPU 접근은 불가하지만, 성능이 뛰어나다다.

---

### 왜 이렇게 두 번 거치나?

Direct3D 12는 **명시적 리소스 관리 API**입니다. CPU와 GPU는 서로 다른 메모리 영역을 사용하기 때문에, CPU가 직접 `DEFAULT_HEAP`에 데이터를 쓸 수 없습니다. 
<br>따라서:

- **UPLOAD_HEAP은 중간 버퍼 역할**
- **DEFAULT_HEAP은 렌더링에 사용되는 최종 버퍼**

---

### 실제 코드 흐름 예시

```cpp
// 1. Upload Heap (CPU 접근용) 버퍼 생성
CD3DX12_HEAP_PROPERTIES uploadHeapProps(D3D12_HEAP_TYPE_UPLOAD);
device->CreateCommittedResource(
    &uploadHeapProps,
    D3D12_HEAP_FLAG_NONE,
    &vertexBufferDesc,
    D3D12_RESOURCE_STATE_GENERIC_READ,
    nullptr,
    IID_PPV_ARGS(&uploadBuffer));

// Map 후 데이터 복사
void* mappedData = nullptr;
uploadBuffer->Map(0, nullptr, &mappedData);
memcpy(mappedData, vertexData, vertexBufferSize);
uploadBuffer->Unmap(0, nullptr);

// 2. Default Heap (GPU 전용) 버퍼 생성
CD3DX12_HEAP_PROPERTIES defaultHeapProps(D3D12_HEAP_TYPE_DEFAULT);
device->CreateCommittedResource(
    &defaultHeapProps,
    D3D12_HEAP_FLAG_NONE,
    &vertexBufferDesc,
    D3D12_RESOURCE_STATE_COPY_DEST,
    nullptr,
    IID_PPV_ARGS(&defaultBuffer));

// 복사 명령 기록
UpdateSubresources<1>(cmdList, defaultBuffer.Get(), uploadBuffer.Get(), 0, 0, 1, &vertexDataDesc);
cmdList->ResourceBarrier(1, &CD3DX12_RESOURCE_BARRIER::Transition(
    defaultBuffer.Get(), D3D12_RESOURCE_STATE_COPY_DEST, D3D12_RESOURCE_STATE_VERTEX_AND_CONSTANT_BUFFER));
```

---

## ✅ 정리

| 단계 | 힙 타입        | 위치            | 목적                                      |
| ---- | -------------- | --------------- | ----------------------------------------- |
| 1    | `UPLOAD_HEAP`  | CPU 접근 메모리 | 데이터 작성 (CPU가 Map하여 복사)          |
| 2    | `DEFAULT_HEAP` | GPU 전용 메모리 | GPU에서 고속 접근을 위한 최종 리소스 저장 |
