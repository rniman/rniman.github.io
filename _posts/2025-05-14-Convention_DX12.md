---
title: Convention | DirectX12 & C++ Coding Convention
date: 2025-05-14 23:25:49 +0900
categories: [Convention, Convention\DirectX]
tags: [DX12, C++, Coding Convention]
author: "rniman"                            # for single entry
# or
# authors: [<author1_id>, <author2_id>]   # for multiple entries
description: "DirectX12와 C++ 개인 코딩 컨벤션을 정리한 글입니다."

comments: false # 댓글 기능
---

# 🎯 DX12, C++ 게임 개발 코딩 컨벤션 (코드 중심 정리본)
최종 수정일(25.05.20) | 적용 중인 프로젝트: Rookiss DX12 강의

---
## 📁 1. 파일 및 디렉토리 구조

- `.h`, `.cpp` 확장자 사용
- `pch.h`, `pch.cpp` → 프리컴파일 헤더
- 시스템/모듈 단위 디렉토리 구성 (예: `Renderer/`, `Core/`, `Resource/`)

---

## 🧱 2. 네이밍 규칙

### ✅ 클래스

- `PascalCase`

### ✅ 함수

- `PascalCase`
- **항상 동사로 시작**
- `bool` 반환 함수는 `Is`, `Has`, `Can`, `Should` 등 의미 있는 접두어 사용

### ✅ 변수

- 지역 변수: `camelCase`
- 멤버 변수: `m` 접두어 + `PascalCase`
예: `mFrameIndex`, `mDevice`
- 정적 멤버 변수: `s` 접두어 + `PascalCase`

### ✅ 전역 변수

- `g` 접두어 + `PascalCase`
예: `gRenderer`, `gInputSystem`

### ✅ 구조체 멤버

- `camelCase`, 접두어 없음

### ✅ 열거형

```cpp
enum class ResourceState
{
    Common,
    RenderTarget,
    CopyDest
};
```

---

## 🎨 3. 코드 스타일

- 중괄호 `{}`는 항상 사용 (한 줄 if문도 예외 없음)
- 포인터는 타입과 붙인다 (`ID3D12Device* device`)
- `nullptr` 사용, `NULL` 금지
- `auto`는 타입이 명확할 때만 사용

---

## 🔐 4. 메모리 관리

- 로우 포인터는 최소화하고, 참조(`&`)를 적극적으로 사용합니다.
    - 읽기 전용 인자는 `const A&`를 기본으로 사용합니다.
    - 스마트 포인터(`ComPtr`, `unique_ptr` 등)는 `const&`로 전달하여 복사 비용 및 참조 카운트 증가를 방지합니다.
    - 포인터는 null 가능성 또는 명시적 소유권 전달 등 **의도가 분명할 때에만** 사용합니다.
- 스마트 포인터 권장 사용:
    - `std::unique_ptr` (기본 선택)
    - `std::shared_ptr` (공유 필요 시)
    - `Microsoft::WRL::ComPtr` (DirectX COM 객체)

```cpp
using Microsoft::WRL::ComPtr;
ComPtr<ID3D12Device> mDevice;
```

---

## 📌 5. 상수 정의

- `#define` 금지
- 컴파일 타임 상수는 **`constexpr`** 사용
- 전역 `constexpr` 상수는 **ALL_CAPS**

```cpp
constexpr int MAX_FRAME_COUNT = 3;
constexpr float PI = 3.14159f;
```

- 런타임 상수는 `const` 사용
- 단, **외부 API(Windows SDK, DirectX 등)에 이미 정의된 매크로는 예외적으로 사용 허용**
예: `MAX_PATH`, `SUCCEEDED(hr)`, `DXGI_FORMAT_R8G8B8A8_UNORM`
- **상수 정의 용도로 `enum` 사용하지 말 것**
(예: `enum { SWAP_CHAIN_BUFFER_COUNT = 2 };` → 대신 `constexpr UINT SWAP_CHAIN_BUFFER_COUNT = 2;` 사용)

---

## 🔍 6. const 사용 원칙

- 읽기 전용 매개변수는 `const T&`
- 읽기 전용 멤버 함수는 `...() const`
- 불변 지역 변수는 `const` 또는 `constexpr`
- 포인터는 대상/자체 불변을 명확히 구분

---

## 🧭 7. 네임스페이스

- `using namespace std;`는 허용
- `using Microsoft::WRL::ComPtr;` 선언 허용

---

## 🧩 8. 클래스 멤버 접근 원칙

- `private` 멤버 변수에는 직접 접근하지 않음
- 반드시 `SetX()`, `GetX()`와 같은 **접근자/설정자 함수**를 통해 간접 접근

```cpp
class Renderer
{
public:
    void SetFrameIndex(UINT index);
    UINT GetFrameIndex() const;

private:
    UINT mFrameIndex;
};
```

- 스마트 포인터 멤버에서 내부 객체를 반환할 때는 `.Get()`을 사용한 raw 포인터 반환을 허용함
- 이 경우 `const` 멤버 함수로 정의하며, `return mXxx.Get();`과 같은 **한 줄 반환 형식을 유지**

```cpp
ID3D12CommandQueue* GetCmdQueue() const { return mCommandQueue.Get(); }
```

---

## 🧷 9. `shared_ptr` 파라미터 전달 원칙

> 💡 해당 프로젝트에서는 const std::shared_ptr<T>& 방식을 기본으로 사용합니다.
> 
- 외부에서 소유권을 유지하고, 내부에서 참조만 하는 것을 전제로 합니다.
- 불필요한 복사를 방지하고, 참조 카운트 증가를 최소화합니다.

| 목적                         | 시그니처 예시                                       |
| ---------------------------- | --------------------------------------------------- |
| 읽기 전용 참조만 할 때       | `const std::shared_ptr<T>& param`                   |
| 공유 및 내부에 저장할 때     | `std::shared_ptr<T> param` (복사, 참조 카운트 증가) |
| 호출자 포인터를 바꿔야 할 때 | `std::shared_ptr<T>& param`                         |
| 소유권을 이동시킬 때         | `std::shared_ptr<T>&& param` + `std::move(...)`     |

> 📌 의도에 따라 가장 의미가 명확한 방식으로 전달할 것.
> 
> 
> "읽기 전용인데 복사한다"거나, "소유권 이전 안 하는데 `&&` 쓰는" 등의 혼동을 피할 것.
> 
> `const std::shared_ptr<T>&` 의 경우, 복사를 한다면 외부에서 삭제가 발생해 dangling 포인터가 되지 않음을 보장할 것.
> 

---

## 🧾 10. 함수 인자 정렬 및 줄바꿈

- 함수 인자가 **4개 이상일 경우 줄바꿈을 권장**합니다.
    - 단, **모든 인자가 짧고 의미가 명확하며 전체 줄 길이가 적당할 경우**, 한 줄로 작성하는 것도 허용합니다.
    - `constexpr`, enum, 포인터 반환 등 단순하고 직관적인 표현만 있을 때 예외 인정
- 반대로 다음과 같은 경우에는 **3개 이하라도 줄바꿈을 고려**해야 합니다:
    - 인자가 긴 체이닝 표현이나 복잡한 타입일 경우
    - 각 인자에 대해 의미 설명 주석이 필요한 경우
    - 함수 호출의 가독성을 명확하게 구분하고 싶을 때

예시:

```cpp
auto barrier = CD3DX12_RESOURCE_BARRIER::Transition(
    backBuffer.Get(),
    D3D12_RESOURCE_STATE_RENDER_TARGET, // before
    D3D12_RESOURCE_STATE_PRESENT        // after
);
```

> 📌 );는 마지막 인자 줄의 끝에 붙이는 것을 원칙으로 하며,
> 
> 
> 들여쓰기 일관성과 구조적 가독성을 유지합니다.
> 

---

## 🧾 11. 함수 정의부 줄바꿈

- 함수 정의부에서도 인자가 4개 이상이거나 각 인자가 복잡한 경우, 줄바꿈을 적용합니다.
- 호출부와 동일하게 각 인자는 한 줄에 하나씩 나열하며, 괄호 위치와 들여쓰기를 일관되게 유지합니다.

예시:

```cpp
void CommandQueue::Init(
    const ComPtr<ID3D12Device>& device,
    const std::shared_ptr<SwapChain>& swapChain,
    const std::shared_ptr<DescriptorHeap>& descHeap
)
{
    ...
}

```

---

## 🧱 12. 클래스 구성 및 정렬 규칙

### 📌 접근 지정자 순서

- 클래스 내부의 접근 지정자는 다음 순서를 유지합니다:

```cpp
public:
protected:
private:
```

- 각 접근자(`public`, `private` 등)는 한 번만 사용하며, 블록 내에서 함수 → 변수 순서로 정리합니다.

---

### 📌 접근자 블록 내부 정렬 순서

### public / protected 블록

1. 생성자, 소멸자
2. 정적 생성 함수 (`Create()`, `GetInstance()` 등)
3. 주요 API 함수 (`Init()`, `Render()`, `Resize()` 등)
4. Getter / Setter 함수

### private 블록

1. 내부 유틸 함수
2. 멤버 변수 (항상 블록의 맨 아래)

---

### 📌 멤버 간 세부 정렬 기준

- 함수 및 변수는 **알파벳 순**이 아닌 **기능 흐름**이나 **의미 단위로 정렬**합니다.
    - 예: `Init → Render → Resize` 순, `GetX → SetX` 묶음
- 멤버 변수는 **기능 단위로 그룹화**하고, 가능한 논리적 흐름을 따릅니다.
    - 예: 렌더링 관련 → 디바이스, 커맨드 큐, 스왑체인 순

---

### ✅ 예시

```cpp
class Example
{
public:
    // 생성자/소멸자
    Example();
    ~Example();

    // 정적 생성 (필요 시)
    static std::shared_ptr<Example> Create();
		
		// public interface
    // 외부에서 호출 가능한 핵심 API
    void Initialize();
    void Update();
    void Render();

    // Getter/Setter
    const ComPtr<ID3D12Device>& GetDevice() const;
protected:
	 // 파생 클래스용 protected 유틸
		
private:
    void InitInternalResources();
    void ResetState();

    // 멤버 변수
};
```

> 📌 작은 클래스에는 과도한 정렬 강제를 피하고, 필요한 경우 의미 중심의 자연스러운 그룹화를 우선시합니다.
> 

---

## 🛡️ 13. 함수 접근 수준 기준

- 클래스 내부 함수는 **외부에서 직접 호출할 필요가 있는지 여부**에 따라 접근 수준을 구분합니다.

### ✅ 기본 원칙

- 외부 인터페이스로 사용되는 함수는 `public`으로 공개
- 외부에서는 사용하지 않고 내부 로직에서만 호출되는 함수는 `private`으로 숨김
- 파생 클래스가 필요로 할 수 있는 내부 유틸 함수는 `protected` 사용

### 📌 장점

- 클래스의 인터페이스가 명확해지고, 사용자가 실수로 내부 함수에 접근하는 것을 방지할 수 있음
- 내부 구현이 변경되더라도 외부 코드에 영향 없이 리팩터링 가능
- 테스트 시 public API에 집중할 수 있어 범위가 축소되고 안정성이 높아짐

### ✅ 예시

```cpp
class SwapChain
{
public:
    void Init(const WindowInfo& info); // 외부 사용 목적

private:
    void CreateSwapChain(...); // 내부 구현 전용
    void CreateRtv(...);       // 내부 구현 전용
};

```

> 📌 "외부에서 접근할 이유가 없다면, private으로 선언하라."는 것이 기본 설계 원칙입니다.
> 

---

## 🚫 14. 매크로 사용 지양 및 대안

- 전역 접근을 위한 매크로(`DEVICE`, `COMMAND_LIST` 등)를 사용하는 방식은 유지보수와 디버깅 측면에서 부작용이 많으므로 지양합니다.

### ❌ 좋지 않은 예시

```cpp
#define DEVICE Engine::GetInstance().GetDevice()->GetDevice()
#define COMMAND_LIST Engine::GetInstance().GetCommandQueue()->GetCommandList()
```

- 추적이 어렵고, 타입 체크가 불가능하며, 내부 구조가 외부로 노출됨

---

## 🧩 15. 헤더 파일 include 및 전방 선언

### ✅ 기본 원칙
- 헤더 파일에서는 가능한 한 전방 선언(forward declaration)을 사용합니다.
- 실제 구현이 필요한 경우에만 헤더를 include 합니다.

### ✅ 전방 선언 사용 예시
```cpp
// 전방 선언
class Device;
class CommandQueue;
struct WindowInfo;

// 필요한 경우에만 include
#include <d3d12.h>
#include <wrl/client.h>
```

### 📌 장점
- 컴파일 시간 단축
- 순환 참조 방지
- 헤더 파일 간의 의존성 감소
- 빌드 시스템의 효율성 향상

### 📌 include가 필요한 경우
- 클래스의 크기나 레이아웃을 알아야 할 때
- 클래스의 상속 관계를 정의할 때
- 템플릿을 사용할 때
- 인라인 함수 구현이 필요할 때

> 📌 "헤더 파일에서는 전방 선언을, cpp 파일에서는 필요한 헤더를 include하라"는 것이 기본 원칙입니다.

## ✏️ Todo…
