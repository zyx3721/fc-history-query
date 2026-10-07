package main

import (
	"flag"
	"fmt"
	"log"
	"net"
	"net/http"
	"strconv"
	"strings"

	"fc-history-query/internal/web"
)

const (
	defaultHost = "127.0.0.1"
	defaultPort = 8088
)

// version 由构建时通过 -ldflags "-X main.version=<版本>" 注入，未注入时为 dev
var version = "dev"

func main() {
	host := flag.String("host", defaultHost, "HTTP listen host")
	port := flag.Int("port", defaultPort, "HTTP listen port")
	showVersion := flag.Bool("v", false, "print version and exit")
	showVersionLong := flag.Bool("version", false, "print version and exit")
	flag.Parse()

	if *showVersion || *showVersionLong {
		fmt.Println("fc-history-query", version)
		return
	}

	address, err := listenAddress(*host, *port)
	if err != nil {
		log.Fatal(err)
	}
	server := web.NewServer()
	log.Printf("FusionCompute history query is listening on http://%s", address)
	if err := http.ListenAndServe(address, server); err != nil {
		log.Fatal(err)
	}
}

func listenAddress(host string, port int) (string, error) {
	host = strings.TrimSpace(host)
	if host == "" {
		return "", fmt.Errorf("host must not be empty")
	}
	if port < 1 || port > 65535 {
		return "", fmt.Errorf("port must be between 1 and 65535")
	}
	return net.JoinHostPort(host, strconv.Itoa(port)), nil
}
