variable "forge_zone_id" {
  description = "Route 53 hosted zone ID for creditchain.org."
  type        = string
}

variable "forge_dns_names" {
  description = "Public Forge hostnames."
  type        = list(string)
  default = [
    "forge.creditchain.org",
    "api.forge.creditchain.org",
    "rpc.forge.creditchain.org",
    "ai.forge.creditchain.org",
    "indexer.forge.creditchain.org"
  ]
}

variable "forge_dns_target" {
  description = "CNAME target, such as maple3.duckdns.org, CloudFront, Vercel, or a load-balancer hostname."
  type        = string
}

resource "aws_route53_record" "forge_public" {
  for_each = toset(var.forge_dns_names)

  zone_id = var.forge_zone_id
  name    = each.value
  type    = "CNAME"
  ttl     = 300
  records = [var.forge_dns_target]
}
