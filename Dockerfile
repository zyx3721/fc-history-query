############################
# 1) builder
############################
FROM golang:1.25-alpine AS builder

WORKDIR /src

COPY . ./
RUN go build -ldflags="-s -w" -o /out/fc-history-query ./cmd/server

############################
# 2) runtime
############################
FROM alpine:3.21

ENV TZ=Asia/Shanghai

COPY --from=builder /out/fc-history-query /usr/local/bin/fc-history-query

EXPOSE 8088

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1:8088/ || exit 1

ENTRYPOINT ["/usr/local/bin/fc-history-query"]
CMD ["--host", "0.0.0.0", "--port", "8088"]
