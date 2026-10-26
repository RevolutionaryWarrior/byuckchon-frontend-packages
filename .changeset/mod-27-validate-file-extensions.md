---
"@byuckchon-frontend/utils": minor
---

feat(validate): validate.file 허용 확장자 확장 및 직접 지정 지원 (MOD-27)

- 기본 허용 확장자에 webp, heic, heif 추가
- 세 번째 인자 `allowedExtensions` 로 허용 확장자를 직접 지정 가능 (대소문자·앞의 점 무시)
- 기본 목록을 `DEFAULT_FILE_EXTENSIONS` 로 export 해 확장해서 쓸 수 있게 함
